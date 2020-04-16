import express from "express";
const app = express();
import axios from "axios";
const Employees = require("./employee.json");
const Projects = require("./project.json");

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