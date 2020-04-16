import express from "ex"
import axios from ("axios");

const express = require("express");
const app = express();
const path = require("path")
const fs = require("fs")

const Employees = require("./employee.json");
const Projects = require("./project.json");


app.get("/:id", (req, res)=>{

    fs.readFile(path.join(__dirname, "employees.json"), "utf-8", (err, data)=>{
        const users = JSON.parse(data);
        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            if(user.name === req.params.id)
                {
                    res.send(JSON.stringify(user));
                }
            else
                {
                    res.send({ error : "user not found" })
                }
        }
    })
         
})

app.get("/", (req, res)=>{
    fs.readFile(path.join(__dirname, "employees.json"), "utf-8", (err, data)=>{
        res.send(data);
    })
});

app.get("/", (req, res)=>{
    fs.readFile(path.join(__dirname, "projects.json"), "utf-8", (err, data)=>{
        res.send(data);
    })
});

app.listen(3000, (err)=>{
    console.log("Server started successfully.");
})

app.get("/employee/:id", (req, res)=>{
    const empID = parseInt(req.params.id, 10);
    if(Number.isNaN(empID))
        {
            res.send("employee id can be number only.")
        }
        
    
    for (let index = 0; index < Employees.length; index++) {
        const employee = Employees[index];
        if(employee.employeeid === parseInt(empID, 10))
            {
                res.send(employee);
            }
    }
    res.send({});
})

app.get("/project/:id", (req, res)=>{
    const projectID = req.params.id
    for (let index = 0; index < Projects.length; index++) {
        const project = Projects[index];
        if(project.projectid === parseInt(projectID, 10))
            {
                res.send(project);
            }
    }
    res.send({});
})

app.get("/getemployeedetails/:id", (req, res)=>{
    const empID = req.params.id
    axios.get(`http://localhost:3001/employee/${empID}`)
    .then((response)=>{
        const employee = response.data
        return axios.get(`http://localhost:3001/project/${employee.project}`)
            .then((responseProject)=>{
                employee.project = responseProject.data;
                // rest operator.
                // return {...employee, project : responseProject.data }
                return employee
            })
    })
    .then((response)=>{
        res.send(response);
    })
})

module.exports = app