const assert = require('assert').strict;
const TimeIntervalUT = require('../../src/core/timeInterval.js');

let startDate;
let timeInterval;

beforeEach(function() {
  startDate = new Date(2000, 0, 0, 0, 0, 0);
  timeInterval = new TimeIntervalUT({ start: startDate });
});

describe('TimeIntervalUT', function() {
  describe('#estimatedEnd(hours = 0, minutes = 0)', function() {
    it('should return start date with requested offset', function() {
      let estimatedEndDate = timeInterval.estimatedEnd(1);
      let expectedDate = new Date(2000, 0, 0, 1, 0, 0);
      assert.deepEqual(estimatedEndDate, expectedDate);

      estimatedEndDate = timeInterval.estimatedEnd(0, 1);
      expectedDate = new Date(2000, 0, 0, 0, 1, 0);
      assert.deepEqual(estimatedEndDate, expectedDate);

      estimatedEndDate = timeInterval.estimatedEnd(24, 60);
      expectedDate = new Date(2000, 0, 1, 1, 0, 0);
      assert.deepEqual(estimatedEndDate, expectedDate);
    });
  });

  describe('#closeInterval(endDate = new Date())', function() {
    it('should set the end and the duration of the interval', function() {
      const endDate = new Date(2000, 0, 0, 1, 2, 3);
      timeInterval.closeInterval(endDate);
      const duration = timeInterval.duration;
      assert.deepEqual(duration, { h: 1, m: 2, s: 3 });
    });
  });
});
