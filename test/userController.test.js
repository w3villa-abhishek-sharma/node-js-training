const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../index.js");

chai.use(chaiAsPromised);
chai.use(chaiHttp);

let token;

describe("###########  API Testing Test Cases  ###########", () => {

    // User Register Test cases
    describe("User Sign Up Testing", () => {
        it("When user not send any data", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-up")
                .end((err, response) => {
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("Provide the valid data.");
                    done();
                })
        })

        it("When user send partially data fields", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-up")
                .send({
                    "username": "abhishekpandit5599",
                    "email": "example@gmail.com"
                })
                .end((err, response) => {
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("Provide the valid data.");
                    done();
                })
        })

        it("When user send proper data fields and data", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-up")
                .send({
                    "username": "abhishekpandit5599",
                    "password": "Abhi@123",
                    "email": "example@gmail.com"
                })
                .end((err, response) => {
                    expect(response.body.status).to.be.equal(true);
                    expect(response.body).to.be.have.all.keys("token", "status");
                    token = response.body.token;
                    done();
                })
        })
        it("When user already registered", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-up")
                .send({
                    "username": "abhishekpandit5599",
                    "password": "Abhi@123",
                    "email": "example@gmail.com"
                })
                .end((err, response) => {
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("User already exist with this username.");
                    done();
                })
        })
    })


    // User Login Test cases
    describe("User Login Testing", () => {
        it("When user not send any data", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-in")
                .end((err, response) => {
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("Provide the valid data.");
                    done();
                })
        })

        it("When user send partially data fields", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-in")
                .send({
                    "username": "abhishekpandit5599"
                })
                .end((err, response) => {
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("Provide the valid data.");
                    done();
                })
        })

        it("When user send valid password and username", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-in")
                .send({
                    "username": "abhishekpandit5599",
                    "password": "Abhi@123"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    expect(response.body).to.be.have.all.keys("token", "status");
                    token = response.body.token;
                    done();
                })
        })

        it("When user send wrong password with right username", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-in")
                .send({
                    "username": "abhishekpandit5599",
                    "password": "Abhi@1234"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("username/password is invalid.");
                    done();
                })
        })
        it("When user send right password with wrong username", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-in")
                .send({
                    "username": "abhishekpandit599",
                    "password": "Abhi@123"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("User not register.");
                    done();
                })
        })
        it("When user send wrong password with wrong username", (done) => {
            chai.request(server)
                .post("/api/v1/user/sign-in")
                .send({
                    "username": "abhishekpandit599",
                    "password": "Abhi@1234"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("User not register.");
                    done();
                })
        })
    })


    // User Get Profile Test cases
    describe("User Get Our Profile", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .get("/api/v1/user/get-user")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .get("/api/v1/user/get-user")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token", (done) => {
            chai.request(server)
                .get("/api/v1/user/get-user")
                .set('token', token)
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body).to.be.have.all.keys("user", "status");
                    done();
                })
        })

    })


    // User Update our profile Test cases
    describe("User Update Our Profile", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .put("/api/v1/user/update-user")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .put("/api/v1/user/update-user")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token but not send proper data", (done) => {
            chai.request(server)
                .put("/api/v1/user/update-user")
                .set('token', token)
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("Provide the valid data.");
                    done();
                })
        })

        it("When user send our valid token with valid data", (done) => {
            chai.request(server)
                .put("/api/v1/user/update-user")
                .set('token', token)
                .send({
                    "password": "Abhi@123",
                    "email": "example1@gmail.com"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    expect(response.body).to.be.have.all.keys("user", "status", "msg");
                    done();
                })
        })

    })


    // User Create task - Test cases
    describe("User Create a Task", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .post("/api/v1/tasks/create-task")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .post("/api/v1/tasks/create-task")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token with invalid data", (done) => {
            chai.request(server)
                .post("/api/v1/tasks/create-task")
                .set('token', token)
                .send({
                    "taskName": "Task1"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("Provide the valid data.");
                    done();
                })
        })

        it("When user send our valid token with valid data", (done) => {
            chai.request(server)
                .post("/api/v1/tasks/create-task")
                .set('token', token)
                .send({
                    "taskName": "Task1",
                    "taskDescription": "Description of task 1"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    expect(response.body).to.be.have.all.keys("status", "msg", "task");
                    done();
                })
        })

    })


    // User Get Our Tasks - Test cases
    describe("User Get Our Task", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .get("/api/v1/tasks/get-task")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .get("/api/v1/tasks/get-task")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token and fetch all tasks", (done) => {
            chai.request(server)
                .get("/api/v1/tasks/get-task")
                .set('token', token)
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    done();
                })
        })
    })


    // User Update our task - Test cases
    describe("User Update Our Task", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .put("/api/v1/tasks/update-task")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .put("/api/v1/tasks/update-task")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token but invalid task id", (done) => {
            chai.request(server)
                .put("/api/v1/tasks/update-task")
                .set('token', token)
                .query({ id: 9999999 })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    done();
                })
        })
        it("When user send our valid token with valid task id", (done) => {
            chai.request(server)
                .put("/api/v1/tasks/update-task")
                .set('token', token)
                .query({ id: 2 })
                .send({
                    "taskName": "Task4",
                    "taskDescription": "Description of task 1"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    done();
                })
        })
    })


    // User Delete our task - Test cases
    describe("User Delete Our Task", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .delete("/api/v1/tasks/delete-task")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .delete("/api/v1/tasks/delete-task")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token but invalid task id", (done) => {
            chai.request(server)
                .delete("/api/v1/tasks/delete-task")
                .set('token', token)
                .query({ id: 9999999 })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(false);
                    done();
                })
        })
        it("When user send our valid token with valid task id", (done) => {
            chai.request(server)
                .delete("/api/v1/tasks/delete-task")
                .set('token', token)
                .query({ id: 2 })
                .send({
                    "taskName": "Task4",
                    "taskDescription": "Description of task 1"
                })
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    done();
                })
        })
    })


    // User Delete our profile/account - Test cases
    describe("User Delete Our Profile", () => {
        it("When user not send token", (done) => {
            chai.request(server)
                .delete("/api/v1/user/delete-user")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(response.body.status).to.be.equal(false);
                    expect(response.body.msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send invalid token", (done) => {
            chai.request(server)
                .delete("/api/v1/user/delete-user")
                .set('token', token + "invalid")
                .end((err, response) => {
                    expect(response.status).to.be.equal(401);
                    expect(JSON.parse(response.error.text).status).to.be.equal(false);
                    expect(JSON.parse(response.error.text).msg).to.be.equal("unauthorized access");
                    done();
                })
        })

        it("When user send our valid token", (done) => {
            chai.request(server)
                .delete("/api/v1/user/delete-user")
                .set('token', token)
                .end((err, response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.status).to.be.equal(true);
                    done();
                })
        })
    })

})


