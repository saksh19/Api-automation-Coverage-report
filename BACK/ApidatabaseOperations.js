import { sequelize, Api, User } from './models.js';
import Op from 'sequelize/lib/operators';

async function insertData(data) {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await Api.sync();

    // Fetch existing records once
    const existingRecords = await Api.findAll({
      where: {
        [Op.or]: data.map(item => ({
          [Op.and]: [
            { path: item.path },
            { method: item.method }
          ]
        }))
      }
    });

    const existingPathsMethods = new Set(existingRecords.map(record => `${record.path}:${record.method}`));

    for (const item of data) {
      if (existingPathsMethods.has(`${item.path}:${item.method}`)) {
        console.log("duplicate entry", item.path, "and method:", item.method, "already exists");
      } else {
        await Api.create({
          path: item.path,
          method: item.method,
          covered: item.covered,
          Tested_by: item.tested_by,
          Test_name: item.test_name
        }, { transaction });

        console.log('Data has been inserted successfully.');
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Unable to connect to the database or insert data:', error);
  }
}

export { insertData }


