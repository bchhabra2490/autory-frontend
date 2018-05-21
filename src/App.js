import React, { Component } from 'react';
import './App.css';
import {Grid, Dropdown, Table, Button, Input} from 'semantic-ui-react';


class App extends Component {

    constructor(){
        super();

        this.state = {
            notifications:[],
            reasons: [],
            values: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitReason = this.submitReason.bind(this);

        let url = 'https://autory-backend.herokuapp.com/v1/api/machine/notifs/1';
        fetch(url).then((data)=>{
            return data.json();
        }).then((res)=>{
            console.log(res.data);
            this.setState({
                notifications:res.data,
                values: res.data.map((i)=>null)
            });
        })
    }

    componentDidMount(){
        let url = 'https://autory-backend.herokuapp.com/v1/api/machine/reasons';
        fetch(url).then((data)=>{
            return data.json();
        }).then((res)=>{
            let options = [];
            (res.data || []).map((reas)=> {
                options.push({key: reas.reason, value: reas.id, text: reas.reason});
            });
            this.setState({
                reasons:options
            });
        })
    }

    submitReason(notifId,i,machine_id){
        console.log(notifId,this.state.value,machine_id);

        let url = 'https://autory-backend.herokuapp.com/v1/api/machine/reason/';
        let data = {
            "notifId": notifId,
            "reason": this.state.value,
            "id": machine_id
        };

        fetch(url,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data),
        }).then((data)=>{
            if(data.ok){
            return data.json();
        }
        throw new Error;
        }).then((res)=>{
            window.location.reload();
        }).catch(console.log);
    };

    handleChange = (e, {value }) => {
        e.preventDefault();
        console.log( value);
        return this.setState({ value })
    };

  render() {

    let notifications = [];

    const notif = (this.state.notifications || []).map((notif,i)=>{
        notifications.push((<Table.Row key={i}><Table.Cell textAlign={"center"}>{notif.details}</Table.Cell><Table.Cell textAlign={"center"}>{notif.date.split('T')[0]} {notif.date.split('T')[1].split('Z')[0]}</Table.Cell><Table.Cell><Dropdown id={`dd${i}`} placeholder='Select Reason' selection options={this.state.reasons} onChange={this.handleChange} /></Table.Cell><Table.Cell><Button onClick={()=>this.submitReason(notif.nid,i,notif.machine_id)}> Submit </Button></Table.Cell></Table.Row>));
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Idle Time Categorisation</h1>
            <div>
                <Input placeholder={"Update Threshold"}/>
                <Button primary>Update</Button>
            </div>
        </header>
          <Grid columns={2}>
              <Grid.Row>
                  <Table celled>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell textAlign={"center"} >Details</Table.HeaderCell>
                              <Table.HeaderCell textAlign={"center"} >Time</Table.HeaderCell>
                              <Table.HeaderCell textAlign={"center"}>Reason</Table.HeaderCell>
                              <Table.HeaderCell textAlign={"center"}>Submit</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                      <Table.Body>
                          {notifications}
                      </Table.Body>
                  </Table>
              </Grid.Row>
          </Grid>
      </div>
    );
  }
}

export default App;
