import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import allMatches from './mocks/matches.mocks';


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

  // it('should return one teams when requested an id', async function () {
  //   const team = TeamModel.build({ id: 1, teamName: 'Loud' });
  //   sinon.stub(TeamModel, 'findByPk').resolves(team);
  //   const { status, body } = await chai.request(app).get('/teams/1');
  //   expect(status).to.eq(200);
  //   expect(body).to.deep.eq(team.dataValues);
  // })
});
