import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import JwtUtils from '../utils/JwtUtils';

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

  it('should end a match', async function() {
    sinon.stub(MatchModel, 'update').resolves([1]);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(JwtUtils, 'verify').resolves(true);
    const match = MatchModel.build(allMatches[0]);
    sinon.stub(MatchModel, 'findByPk').resolves(match);
    const { status, body } = await chai.request(app).patch('/matches/41/finish')
      .set('authorization', token);
    expect(status).to.eq(200);
    expect(body).to.deep.eq({ message: 'Finished' });
  });

  it('shouldnt end a match without a token', async function() {
    sinon.stub(MatchModel, 'update').resolves([1]);
    const match = MatchModel.build(allMatches[0]);
    sinon.stub(MatchModel, 'findByPk').resolves(match);
    const { status, body } = await chai.request(app).patch('/matches/41/finish');
    expect(status).to.eq(401);
    expect(body).to.deep.eq({ message: 'Token not found' });
  });

  it('shouldnt end a match whith an invalid token', async function() {
    const { status, body } = await chai.request(app).patch('/matches/41/finish')
      .set('authorization', 'invalid token');
    expect(status).to.eq(401);
    expect(body).to.deep.eq({ message: 'Token must be a valid token' });
  });

  it('should edit a match', async function() {
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(JwtUtils, 'verify').resolves(true);
    sinon.stub(MatchModel, 'update').resolves([1]);
    const match = MatchModel.build(allMatches[0]);
    sinon.stub(MatchModel, 'findByPk').resolves(match)
    const { status, body } = await chai.request(app).patch('/matches/1/')
      .set('authorization', token)
      .send({
        homeTeamGoals: '5',
        awayTeamGoals: '2'
      });
    expect(status).to.eq(200);
    expect(body).to.deep.eq({ message: 'Finished' });
  });

  it('should add a match', async function() {
    const newMatch = {
      homeTeamId: 16,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    };
    const endMatch = {
      id: 1,
      homeTeamId: 16,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true,
    }
    const created = MatchModel.build(endMatch);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(JwtUtils, 'verify').resolves(true);
    sinon.stub(MatchModel, 'create').resolves(created);
    const match = MatchModel.build(allMatches[0]);
    sinon.stub(MatchModel, 'findByPk').resolves(match)
    const { status, body } = await chai.request(app).post('/matches/')
      .set('authorization', token)
      .send(newMatch);
    expect(status).to.eq(201);
    expect(body).to.deep.eq(endMatch);
  });
  // teste
});
