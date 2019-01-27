const proxyquire = require('proxyquire').noCallThru();
const expect = require('chai').expect;
const sinon = require('sinon');

const usersEmail = 'usersEmail@usersEmail';
const notFoundError = new Error('notFoundError');
class TimeIntervalSchemaMock {
  constructor({ start, end, tags, owner }) {
    if (!start) {
      this.start = new Date().getTime();
    } else {
      this.start = start;
    }
    this.end = end;
    this.tags = !tags ? [] : tags;
    this.owner = owner;
  }

  save(callback) {
    callback(null, this);
  }

  static findOne(params, callback) {
    if (params._id === '1' && params.owner === usersEmail) {
      callback(null, { _id: '1', owner: usersEmail });
    } else {
      callback(notFoundError);
    }
  }

  static find(params, callback) {
    if (params.start === 'someValueThatWillReturnNoMatch') {
      callback(notFoundError);
    } else {
      callback(null, params);
    }
  }
}

describe('timeIntervalUT', function() {
  describe('actions', function() {
    function injectMocksToTestedModule(injectedEmail) {
      const tokenDataDecoderMock = {
        parseEmail() {
          return injectedEmail;
        },
      };
      return proxyquire(
        '/home/montolio/IdeaProjects/Timeman_backend/src/core/timeInterval/actions.js',
        // '../../../src/core/timeInterval/actions',
        {
          './model': TimeIntervalSchemaMock,
          '../../security/tokenDataDecoder.js': tokenDataDecoderMock,
        }
      );
    }

    const timeIntervalActions = injectMocksToTestedModule(usersEmail);

    describe('createTimeInterval', function() {
      it('should create default TimeInterval', function() {
        const req = {
          body: {},
        };
        let response;
        const res = {
          json: objFromDB => (response = objFromDB),
        };
        timeIntervalActions.createTimeInterval(req, res);
        expect(response.start).to.not.be.null;
        expect(response.end).to.be.undefined;
        expect(response.tags).to.be.deep.equal([]);
        expect(response.owner).to.be.equal(usersEmail);
      });
      it('should create TimeInterval from request body', function() {
        const tags = ['1', '2'];
        const req = {
          body: JSON.stringify({
            start: 10,
            end: 20,
            tags,
            owner: 'should be override',
          }),
        };
        let response;
        const res = {
          json: objFromDB => (response = objFromDB),
        };
        timeIntervalActions.createTimeInterval(req, res);
        expect(response.start).to.be.equal(10);
        expect(response.end).to.be.equal(20);
        expect(response.tags).to.be.deep.equal(tags);
        expect(response.owner).to.be.equal(usersEmail);
      });
    });

    describe('getTimeIntervalById', function() {
      it('should return single interval by id, that is passed via request params, if this interval was created by current user', function() {
        const req = { params: { id: '1' } };
        let response;
        const res = {
          json: objFromDB => (response = objFromDB),
        };
        timeIntervalActions.getTimeIntervalById(req, res);
        expect(response.length).to.be.equal(1);
        expect(response[0].owner).to.be.equal(usersEmail);
        expect(response[0]._id).to.be.equal('1');
      });
      it("should not return other user's intervals, should return empty array", function() {
        const timeIntervalActions = injectMocksToTestedModule(
          'someOtherUser@email'
        );
        const req = { params: { id: '1' } };
        let response;
        const res = {
          json: objFromDB => (response = objFromDB),
        };
        timeIntervalActions.getTimeIntervalById(req, res);
        expect(response).to.be.deep.equal([]);
      });
      it('should return empty array in case of no match', function() {
        const req = { params: { id: 'non existing id' } };
        let response;
        const res = {
          json: objFromDB => (response = objFromDB),
        };
        timeIntervalActions.getTimeIntervalById(req, res);
        expect(response).to.be.deep.equal([]);
      });
    });

    describe('getTimeIntervals', function() {
      it(
        'should return call Mongoose find with params end return 0 or more intervals, that were created by user. ' +
          'Only "start", "end" and "tags" params allowed',
        function() {
          const req = {
            params: {
              id: '1',
              start: { $gte: 18 },
              end: { lte: 20 },
              tags: { $in: ['sushi'] },
              someParamThatIsNotAllowed: '',
            },
          };
          let response;
          const res = {
            json: objFromDB => (response = objFromDB),
          };
          timeIntervalActions.getTimeIntervals(req, res);
          expect(response).to.be.deep.equal([
            {
              start: { $gte: 18 },
              end: { lte: 20 },
              tags: { $in: ['sushi'] },
              owner: usersEmail,
            },
          ]);
        }
      );
      it('should return empty array in case of no match', function() {
        const req = { params: { start: 'someValueThatWillReturnNoMatch' } };
        let response;
        const res = {
          json: objFromDB => (response = objFromDB),
        };
        timeIntervalActions.getTimeIntervals(req, res);
        expect(response).to.be.deep.equal([]);
      });
    });
  });
});
