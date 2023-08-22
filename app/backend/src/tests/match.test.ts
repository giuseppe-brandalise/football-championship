import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import allMatches from './mocks/matches.mocks';
import token from './mocks/auth.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Tests for Matches', function() {
  beforeEach( function () {
    sinon.restore();
  })

  it('should return a list with all matches', async function() {
    sinon.stub(MatchModel, 'findAll').resolves(allMatches as any);
    const { status, body } = await chai.request(app).get('/matches');
    expect(status).to.eq(200);
    expect(body).to.deep.eq(allMatches);
  });

  it('should return a list with all matches in progress', async function() {
    sinon.stub(MatchModel, 'findAll').resolves(allMatches[1] as any);
    const { status, body } = await chai.request(app).get('/matches?inProgress=true');
    expect(status).to.eq(200);
    expect(body).to.deep.eq(allMatches[1]);
  });

  it('should return a list with all matches finished', async function() {
    sinon.stub(MatchModel, 'findAll').resolves(allMatches[0] as any);
    const { status, body } = await chai.request(app).get('/matches?inProgress=false');
    expect(status).to.eq(200);
    expect(body).to.deep.eq(allMatches[0]);
  });

  it('shouldnt end a match without a token', async function() {
    sinon.stub(MatchModel, 'update').resolves();
    const { status, body } = await chai.request(app).patch('/matches/41/finished');
    expect(status).to.eq(401);
    expect(body).to.deep.eq({ message: 'Token not found' });
  });

  it('shouldnt end a match whith an invalid token', async function() {
    sinon.stub(MatchModel, 'update').resolves([1]);
    const match = MatchModel.build(allMatches[0]);
    sinon.stub(MatchModel, 'findByPk').resolves(match)
    const { status, body } = await chai.request(app).patch('/matches/41/finished')
      .set('authorization', token);
    expect(status).to.eq(401);
    expect(body).to.deep.eq({ message: 'Token must be a valid token' });
  });
});
