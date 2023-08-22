import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import JwtUtils from '../utils/JwtUtils';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import token from './mocks/auth.mocks';


chai.use(chaiHttp);

const { expect } = chai;

describe('Tests for Login', function() {
  const failMessage = 'Invalid email or password';
  const noFieldMessage = 'All fields must be filled';
  beforeEach( function () {
    sinon.restore();
  })

  it('should return a token in case of a sucess', async function() {
    const user = UserModel.build({
      id: 1,
      username: 'Mario',
      role: 'plumber',
      email: 'anotherCastle@email.com',
      password: 'Peaches - Jack Black'
    });
    const userLogin = {
      email: 'anotherCastle@email.com',
      password: 'Peaches - Jack Black',
    };
    sinon.stub(UserModel, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(JwtUtils, 'sign').resolves(token);
    const { status, body } = await chai.request(app).post('/login')
      .send(userLogin);
    expect(status).to.eq(200);
    expect(body).to.haveOwnProperty('token');
  });

  it('should return a error in case of no email', async function() {
    const noEmail = {
      password: 'Peaches - Jack Black',
    };
    const { status, body } = await chai.request(app).post('/login')
      .send(noEmail);
    expect(status).to.eq(400);
    expect(body.message).to.deep.eq(noFieldMessage);
  });

  it('should return a error in case of no password', async function() {
    const noPassword = {
      email: 'anotherCastle@email.com',
    };
    const { status, body } = await chai.request(app).post('/login')
      .send(noPassword);
    expect(status).to.eq(400);
    expect(body.message).to.deep.eq(noFieldMessage);
  });

  it('should return a error in case of an incorrect written email', async function() {
    const incorrectEmail = {
      email: 'anotherCastle@bowser',
      password: 'Peaches - Jack Black',
    };
    const { status, body } = await chai.request(app).post('/login')
      .send(incorrectEmail);
    expect(status).to.eq(401);
    expect(body.message).to.deep.eq(failMessage);
  });

  it('should return a error in case of a password with less than 6 letters', async function() {
    const incorrectPassword = {
      email: 'anotherCastle@email.com',
      password: 'Peach',
    };
    const { status, body } = await chai.request(app).post('/login')
      .send(incorrectPassword);
    expect(status).to.eq(401);
    expect(body.message).to.deep.eq(failMessage);
  });

  it('should return a error in case of a incorrect email', async function() {
    const userLogin = {
      email: 'anotherCastle@email.com',
      password: 'Peaches - Jack Black',
    };
    sinon.stub(UserModel, 'findOne').resolves();
    const { status, body } = await chai.request(app).post('/login')
      .send(userLogin);
    expect(status).to.eq(401);
    expect(body.message).to.deep.eq(failMessage);
  });

  it('should return a error in case of a incorrect password', async function() {
    const user = UserModel.build({
      id: 1,
      username: 'Mario',
      role: 'plumber',
      email: 'anotherCastle@email.com',
      password: 'Peaches - Tenacious D'
    });
    const userLogin = {
      email: 'anotherCastle@email.com',
      password: 'Peaches - Jack Black',
    };
    sinon.stub(UserModel, 'findOne').resolves(user);
    const { status, body } = await chai.request(app).post('/login')
      .send(userLogin);
    expect(status).to.eq(401);
    expect(body.message).to.deep.eq(failMessage);
  });
});
