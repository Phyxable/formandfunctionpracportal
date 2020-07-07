import React, { Component } from 'react';
import ADD_BUTTON from './assets/icons/add-button.svg';
import CHECK_BUTTON from './assets/icons/check-button.svg';
import USER from './assets/icons/user.png'

class SearchBar extends Component{
    constructor(props) {
        super(props);

        const initialSelectedUsers = JSON.parse(localStorage.selected_users || '[]');

        this.state = { 
            word: '',
            filterDisplay: '',
            selected_users: initialSelectedUsers
        };
    }

    componentDidMount(){
        this.setState({filterDisplay: this.props.users})
    }

    handleChange = e => {
        let oldList = this.props.users;

        if(e !== ''){
            let newList = [];
            this.setState({ word: e.toLowerCase() });
            newList = oldList.filter(users => {
                return Object.keys(users).some(key =>
                  users.email !== null ? users.email.toLowerCase().includes(this.state.word) : users
                );
              }
            );
            this.setState({ filterDisplay: newList });
        } 
        else {
            this.setState({ filterDisplay: this.props.users })
        }
    }

    addItem(users,indexToAdd) {
        const selected_users = [...this.state.selected_users, users];
        localStorage.setItem('selected_users', JSON.stringify(selected_users));
        this.setState({ selected_users });
        let filterDisplay = [...this.state.filterDisplay].filter(
            (item, index) => index !== indexToAdd
        );
        this.setState({ filterDisplay });
    }

    removeItem(user,indexToDelete) {
        let selected_users = [...this.state.selected_users].filter(
            (item, index) => index !== indexToDelete
        );
        localStorage.setItem('selected_users', JSON.stringify(selected_users)); 
        this.setState({ selected_users });
        this.setState({ filterDisplay: [...this.state.filterDisplay , user ] })
      }

    render(){
        return(
            <div className='container'>
                <div className='center futura-20-900'>Assign Client(s)</div>
                <div className='center margin-top-8 futura-16-300'>Add or select clients E-mail</div>
                <input placeholder='Search Users...' className='search-bar-users' onChange={e => this.handleChange(e.target.value)} />
                {
                    this.state.selected_users && this.state.selected_users.map((user, i) => (
                    <div className="users-container" key={i} style={{ border: '2px solid #9EEAA7' }}>
                    <div className="flex-row">
                    <div className="flex-1 center margin-auto" style={{ maxWidth: '64px' }}>
                        {/* <i className="fa fa-user" style={{ fontSize: "24px", color:"gray" }}></i> */}
                        <img src={USER} style={{ width: '36px' }}></img>
                    </div>
                    <div className="flex-1 futura-14-900 margin-auto">
                    {user.name}
                    <br />
                    <div className="futura-12-300">
                    {user.email}
                    </div>
                    </div>
                    <div className="flex-row">
                    <div className="flex-1 center margin-top-2">
                        <img src={CHECK_BUTTON} style={{ cursor: 'pointer', marginRight: '8px' }} onClick={() => this.removeItem(user,i) } />
                    </div>
                    </div>
                    </div>
                    </div>
                    ))
                }
                
                {this.state.filterDisplay.length !== 0 ? this.state.filterDisplay.map((users, j) => (
                    <div className="users-container" key={j}>
                    <div className="flex-row">
                    <div className="flex-1 center margin-auto" style={{ maxWidth: '64px' }}>
                        {/* <i className="fa fa-user" style={{ fontSize: "24px", color:"gray" }}></i> */}
                        <img src={USER} style={{ width: '36px' }}></img>
                    </div>
                    <div className="flex-1 futura-14-900 margin-auto">
                    {users.name}
                    <br />
                    <div className="futura-12-300">
                    {users.email}
                    </div>
                    </div>
                    <div className="flex-row">
                    <div className="flex-1 center margin-top-2">
                        <img src={ADD_BUTTON} style={{ cursor: 'pointer', marginRight: '8px' }} onClick={() => this.addItem(users,j) } />
                    </div>
                    </div>
                    </div>
                    </div>
                    ))
                : <div className='center gray futura-14-300 margin-top-16'>No users found</div>}
                <div style={{ paddingBottom: '100px' }}/>
                <div className="bottom-button">
                <button className="button" onClick={() => {
                    this.props.handleUserData(this.state.selected_users, this.state.filterDisplay)
                }}>NEXT
                </button></div>
            </div>
        )
    }
}

export default SearchBar;