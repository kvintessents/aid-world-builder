const { Router } = require('express');
const sql = require('sql-template-strings');
const asyncRoute = require('../../utils/asyncRoute');
const query = require('../../utils/query');
const migrationModel = require('./migrationModel');
const getMigrationSteps = require('./migrationSteps');
const router = Router();

async function doStep(step) {
    try {
        await step.action({ sql, query });
    } catch (error) {
        return {
            success: false,
            message: 'Error when doing migration step.',
            error,
        };
    }

    try {
        await migrationModel.markAsDone(step.id);
    } catch (error) {
        return {
            success: false,
            message: 'Error when marking migration step as done.',
            error,
        };
    }

    return { success: true };
}

router.get('/migrate/all', asyncRoute(async function(req, res) {
    if (req.query.passwd !== process.env.DB_MIGRATION_PASSWORD) {
        return res.status(404).json({ success: false, error: 'Not found.' });
    }

    try {
        await migrationModel.ensure();
    } catch (e) {
        console.error(e);
        res.json({ success: false, error: e });
        return;
    }

    const migrationSteps = await getMigrationSteps();
    const migrationsDone = await migrationModel.getFullList();
    const migrationsToDo = migrationSteps.filter(step => {
        return !migrationsDone.find(doneMigration => doneMigration.id === step.id);
    });
    const stepsTaken = [];

    for (const step of migrationsToDo) {
        const result = await doStep(step);

        if (!result.success) {
            res.status(500).json(Object.assign({ step }, result));
            return;
        }

        stepsTaken.push(step);
    }

    return res.json({ success: true, migrationsToDo, stepsTaken });
}));

module.exports = router;
