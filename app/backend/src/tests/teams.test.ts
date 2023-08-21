import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import allTeams from './mocks/teams.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Tests for Teams', function() {
  beforeEach( function () {
    sinon.restore();
  })

  it('should return a list with all teams', async function() {
    sinon.stub(TeamModel, 'findAll').resolves(allTeams as any);
    const { status, body } = await chai.request(app).get('/teams');
    expect(status).to.eq(200);
    expect(body).to.deep.eq(allTeams);
  });

  it('should return one teams when requested an id', async function () {
    const team = TeamModel.build({ id: 1, teamName: 'Loud' });
    sinon.stub(TeamModel, 'findByPk').resolves(team);
    const { status, body } = await chai.request(app).get('/teams/1');
    expect(status).to.eq(200);
    expect(body).to.deep.eq(team.dataValues);
  })
});
