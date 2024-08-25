const redisClient = require('../config/redisClient');
const db = require("../models");
const WebSocket = require('ws');
const axios = require('axios');

// Get data from Redis
const getDataFromCache = async (key) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData;
  } catch (err) {
    console.error('Redis GET error:', err);
    throw err;
  }
};

// Set data in Redis
const setDataInCache = async (key, value, ttl) => {
  try {
    await redisClient.setEx(key, ttl, value);
  } catch (err) {
    console.error('Redis SETEX error:', err);
  }
};

const fetchCountryData = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data;

    // Format data untuk kode negara dan nama negara
    const countryMap = countries.reduce((acc, country) => {
      const code = country.cca2; // Kode negara 2 huruf
      const name = country.name.common; // Nama negara
      acc[code] = name;
      return acc;
    }, {});

    return countryMap;
  } catch (error) {
    console.error('Error fetching country data:', error);
    throw error;
  }
};

// Fetch data from API and send to WebSocket client
const fetchDataAndSend = async (ws) => {
  try {
    const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
    const attacks = response.data;
    
    // Send data to WebSocket client
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(attacks));
    }
  } catch (error) {
    console.error('Error fetching and sending data:', error);
  }
};

// Fetch data from API and save to database
const fetchDataAndSave = async () => {
  try {
    const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
    const attacks = response.data;

    // Log untuk memastikan format data
    // console.log('Received attacks data:', attacks);

    // Akses elemen pertama dari array jika data adalah array dalam array
    const attackList = Array.isArray(attacks) && Array.isArray(attacks[0]) ? attacks[0] : attacks;

    if (attackList && Array.isArray(attackList)) {
      const attackInserts = attackList.map(async (attack, index) => {
        // Log untuk memastikan data yang diambil
        // console.log('Processing attack:', attack);

        const { sourceCountry, destinationCountry, millisecond, type, weight, attackTime } = attack;

        // Log nilai setelah destructuring
        // console.log('Destructured values:', {
        //   sourceCountry,
        //   destinationCountry,
        //   millisecond,
        //   type,
        //   weight,
        //   attackTime
        // });

        try {
          // Insert data into the database
          await db.sequelize.query(
            `INSERT INTO public.attacks (sourcecountry, destinationcountry, millisecond, type, weight, attacktime)
             VALUES (:sourceCountry, :destinationCountry, :millisecond, :type, :weight, :attackTime)`,
            {
              replacements: { 
                sourceCountry: sourceCountry || null,
                destinationCountry: destinationCountry || null,
                millisecond: millisecond || null,
                type: type || null,
                weight: weight || null,
                attackTime: attackTime || null
              },
              type: db.Sequelize.QueryTypes.INSERT
            }
          );

          // Log success
          // console.log('Data inserted successfully for index', index, {
          //   sourceCountry: sourceCountry || null,
          //   destinationCountry: destinationCountry || null,
          //   millisecond: millisecond || null,
          //   type: type || null,
          //   weight: weight || null,
          //   attackTime: attackTime || null
          // });
        } catch (insertError) {
          console.error(`Error inserting data at index ${index}:`, insertError);
        }
      });

      await Promise.all(attackInserts);
      console.log('All data inserted successfully');
    } else {
      console.error('Invalid data format received:', attackList);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// WebSocket server setup
exports.callmeWebSocket = (server) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);

      // Fetch and save data immediately
      fetchDataAndSend(ws);
      fetchDataAndSave(); 

      const interval = setInterval(() => {
        fetchDataAndSend(ws); // Send data to WebSocket
        fetchDataAndSave(); // Fetch and save data every 3 minutes
      }, 180000);

      ws.on('close', () => {
        clearInterval(interval);
      });
    });
  });

  console.log('WebSocket server is running.');
};

// function ini sebenarnya adalah hasil survey dri beberapa pertnayaan, yang mana nilai dri jawaban tsb akan di store pada array seperti yang ada di dataset
exports.refactoreMe1 = async (req, res) => {
  try {
    const query = `
      SELECT
        AVG((values[1])::int) AS avg1,
        AVG((values[2])::int) AS avg2,
        AVG((values[3])::int) AS avg3,
        AVG((values[4])::int) AS avg4,
        AVG((values[5])::int) AS avg5,
        AVG((values[6])::int) AS avg6,
        AVG((values[7])::int) AS avg7,
        AVG((values[8])::int) AS avg8,
        AVG((values[9])::int) AS avg9,
        AVG((values[10])::int) AS avg10
      FROM public.surveys
    `;

    const results = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    if (results.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No data found.",
        success: false,
      });
    }

    const totalIndex = [
      results[0].avg1, results[0].avg2, results[0].avg3, results[0].avg4,
      results[0].avg5, results[0].avg6, results[0].avg7, results[0].avg8,
      results[0].avg9, results[0].avg10
    ];

    res.status(200).send({
      statusCode: 200,
      success: true,
      data: totalIndex,
    });
  } catch (error) {
    console.error("Error in refactoreMe1:", error);
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error.",
      success: false,
    });
  }
};

// function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
exports.refactoreMe2 = async (req, res) => {
  const { userId, values, id } = req.body;

  console.log("Request Body:", { userId, values, id });

  const insertSurveyQuery = `
    INSERT INTO public.surveys ("values", "createdAt", "updatedAt", "userId")
    VALUES (ARRAY[:values]::integer[], NOW(), NOW(), :userId) RETURNING *
  `;

  const updateUserQuery = `
    UPDATE public.users
    SET dosurvey = true
    WHERE id = :id
  `;

  try {
    await db.sequelize.transaction(async (t) => {
      console.log("Inserting survey data...");
      const [survey] = await db.sequelize.query(insertSurveyQuery, {
        replacements: { values, userId },
        type: db.Sequelize.QueryTypes.INSERT,
        transaction: t
      });
      
      console.log("Survey inserted:", survey);

      console.log("Updating user status...");
      await db.sequelize.query(updateUserQuery, {
        replacements: { id },
        type: db.Sequelize.QueryTypes.UPDATE,
        transaction: t
      });

      res.status(201).send({
        statusCode: 201,
        message: "Survey sent successfully!",
        success: true,
        data: survey,
      });
    });
  } catch (error) {
    console.error("Error in refactoreMe2:", error);
    res.status(500).send({
      statusCode: 500,
      message: "Cannot post survey.",
      success: false,
    });
  }
};

exports.getData = async (req, res) => {
  const cacheKey = 'attacksData';

  try {
    // Coba ambil data dari cache Redis
    const cachedData = await getDataFromCache(cacheKey);

    if (cachedData) {
      console.log('Cache hit');
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: JSON.parse(cachedData)
      });
    } else {
      console.log('Cache miss');

      // Ambil data negara dari API Restcountries
      const countryMap = await fetchCountryData();

      // Query untuk mendapatkan data dari database
      const query = `
        SELECT
          country,
          SUM(total) AS total
        FROM (
          SELECT
            destinationCountry AS country,
            COUNT(*) AS total
          FROM public.attacks
          GROUP BY destinationCountry
          UNION ALL
          SELECT
            sourceCountry AS country,
            COUNT(*) AS total
          FROM public.attacks
          GROUP BY sourceCountry
        ) AS combined
        GROUP BY country
      `;

      const results = await db.sequelize.query(query, {
        type: db.Sequelize.QueryTypes.SELECT
      });

      // Memformat data sesuai dengan respon yang diinginkan
      const labels = results.map(row => countryMap[row.country.trim()] || row.country);
      const totals = results.map(row => parseInt(row.total, 10));

      const responseData = {
        label: labels,
        total: totals
      };

      // Simpan data ke cache Redis
      console.log('Setting data in cache:', responseData);
      await setDataInCache(cacheKey, JSON.stringify(responseData), 300);

      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: responseData
      });
    }
  } catch (error) {
    console.error('Error in getData:', error);
    res.status(500).send({
      success: false,
      statusCode: 500,
      message: 'Internal server error.'
    });
  }
};