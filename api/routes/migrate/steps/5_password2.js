const getPasswordHash = require('../../../utils/getPasswordHash');

module.exports = async ({ sql, query }) => {
    const columns = await query(sql`SHOW COLUMNS FROM users`);

    const hasPassword2Table = columns.find(column => column.Field === 'password2');

    if (!hasPassword2Table) {
        await query(sql`
            ALTER TABLE users
            ADD password2 VARCHAR(255) NOT NULL DEFAULT ''
        `);
    }

    const users = await query(sql`
        SELECT * FROM users WHERE password2 = ''
    `);

    console.log(users.length);

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        
        console.log('USER', user);
        
        const singleSaltedPassword = user.password;
        console.log('OLD PASSWORD', singleSaltedPassword);
        const doubleSaltedPassword = getPasswordHash(singleSaltedPassword, process.env.USER_PASSWORD_SALT2);
        console.log('NEW PASSWORD', doubleSaltedPassword);

        // await query(sql`
        //     UPDATE password2 = ${doubleSaltedPassword} WHERE id = ${user.id}
        // `);
    }

    throw new Error('Debug cancel');

    return;
}