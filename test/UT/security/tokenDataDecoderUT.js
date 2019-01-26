const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('tokenDataDecoderUT', function() {
  describe('parseEmail', function() {
    const usersEmail = 'usersEmail@usersEmail';
    const validToken = 'validToken';
    const jwtMock = {
      decode(token) {
        return token === validToken
          ? { 'https://montoliov.ml/rs|email': usersEmail }
          : null;
      },
    };
    const tokenDataDecoderWithMocks = proxyquire(
      '../../../src/security/tokenDataDecoder',
      {
        jsonwebtoken: jwtMock,
      }
    );

    it("should return user's email if auth token is present and valid", function() {
      const req = {
        get(header) {
          expect(header).to.be.equal('authorization');
          return validToken;
        },
      };
      const parsedEmail = tokenDataDecoderWithMocks.parseEmail({ req });
      expect(parsedEmail).to.be.equal(usersEmail);
    });
    it('should return null if auth token is missing', function() {
      const req = {
        get(header) {
          expect(header).to.be.equal('authorization');
          return null;
        },
      };
      const parsedEmail = tokenDataDecoderWithMocks.parseEmail({ req });
      expect(parsedEmail).to.be.null;
    });
    it('should return null if auth token is present but malformed', function() {
      const req = {
        get(header) {
          expect(header).to.be.equal('authorization');
          return 'malformed token';
        },
      };
      const parsedEmail = tokenDataDecoderWithMocks.parseEmail({ req });
      expect(parsedEmail).to.be.null;
    });
  });
});
