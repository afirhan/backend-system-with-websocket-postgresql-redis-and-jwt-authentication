const db = require('../models');

async function seed() {
    try {    
        await db.User.bulkCreate([
            {
                id: 1,
                digits: 'DFA',
                fotoUrl: '',
                workType: 'WFO',
                positionTitle: null,
                lat: 0.0,
                lon: 0.0,
                company: 'NTX',
                isLogin: true,
                createdAt: new Date('2021-12-15T08:06:33Z'),
                updatedAt: new Date('2022-12-22T14:05:32.377Z'),
                dovote: true,
                dosurvey: true,
                dofeedback: false,
                fullname: 'M. Daffa Quraisy',
                cuurentLeave: 0
            },
            {
                id: 2,
                digits: 'HTA',
                fotoUrl: '',
                workType: 'WFH',
                positionTitle: null,
                lat: 0.0,
                lon: 0.0,
                company: 'NTX',
                isLogin: true,
                createdAt: new Date('2021-12-15T08:06:33Z'),
                updatedAt: new Date('2022-12-22T08:04:01.302Z'),
                dovote: true,
                dosurvey: true,
                dofeedback: false,
                fullname: 'R. Hernanta Subagya',
                cuurentLeave: 0
            },
            {
                id: 3,
                digits: 'HFW',
                fotoUrl: '',
                workType: 'WFO',
                positionTitle: null,
                lat: 0.0,
                lon: 0.0,
                company: 'NTX',
                isLogin: true,
                createdAt: new Date('2021-12-15T08:06:33.226Z'),
                updatedAt: new Date('2022-12-22T08:03:46.848Z'),
                dovote: true,
                dosurvey: false,
                dofeedback: false,
                fullname: 'Hafidz Wibowo',
                cuurentLeave: 0
            }
        ], {
            updateOnDuplicate: ['digits', 'fotoUrl', 'workType', 'positionTitle', 'lat', 'lon', 'company', 'isLogin', 'createdAt', 'updatedAt', 'dovote', 'dosurvey', 'dofeedback', 'fullname', 'cuurentLeave']
        });

        await db.Survey.bulkCreate([
            {
                values: [100, 100, 90, 90, 100],
                createdAt: new Date('2022-12-22T01:56:50.696Z'),
                updatedAt: new Date('2022-12-22T01:56:50.696Z'),
                userId: 1
            },
            {
                values: [90, 100, 100, 80, 90],
                createdAt: new Date('2022-12-22T02:08:50.908Z'),
                updatedAt: new Date('2022-12-22T02:08:50.908Z'),
                userId: 2
            },
            {
                values: [80, 80, 80, 80, 80],
                createdAt: new Date('2022-12-22T14:05:32.317Z'),
                updatedAt: new Date('2022-12-22T14:05:32.317Z'),
                userId: 3
            }
        ], {
            updateOnDuplicate: ['values', 'createdAt', 'updatedAt', 'userId']
        });

        await db.Role.bulkCreate([
            { id: 1, name: 'admin' },
            { id: 2, name: 'user' }
        ], {
            updateOnDuplicate: ['name']
        });

        await db.UserRole.bulkCreate([
            { userId: 1, roleId: 1 },
            { userId: 2, roleId: 2 },
            { userId: 3, roleId: 2 }
        ], {
            updateOnDuplicate: ['userId', 'roleId']
        });

        console.log('Data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

module.exports = seed;