'use strict';
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
// 
/* GET home page. */
router.get('/', async (req, res, next) => {
  const title = '予定調整くん';
  if (req.user) {
    const schedules = await Schedule.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    });
    schedules.forEach((schedule) => {
      schedule.formattedUpdatedAt = dayjs(schedule.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:MM');
    })
    res.render('index', {
      title: title,
      user: req.user,
      schedules: schedules
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
