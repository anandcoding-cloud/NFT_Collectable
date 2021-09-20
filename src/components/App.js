import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json';
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3( )
    await this.loadBlockchainData()
  }

async loadWeb3() {
  if(window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3){
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else{
    window.alert('Non Ethereum browser detected')
  }
}

async loadBlockchainData(){
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  this.setState({account: accounts[0]})

  const newworkId = await web3.eth.net.getId()
  const neworkData = Color.networks[newworkId]
  if(neworkData){
    const abi= Color.abi
    const address = neworkData.address
    const contract = new web3.eth.Contract(abi, address)
    this.setState({ contract})
    const totalSupply = await contract.methods.totalSupply.call()
    this.setState({totalSupply})
    console.log(totalSupply)
    for(var i = 1; i <= totalSupply; i++){
        const colors = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, colors]
        })
      }
      console.log(this.state.colors)
  } else{
    window.alert(' Smart Contract not available in the networks')
  }


  
}
  mint = (colors) => {
    console.log(colors)
    this.state.contract.methods.mint(colors).send({from: this.state.account})
    .once('receipt',(receipt) => {
      this.setState({
        colors: [ ...this.state.colors,colors]
      })
    })
  }

constructor(props) {
  super(props)
  this.state = {
    account: '',
    contract: null,
    totalSupply: 0,
    colors: []
  }
}

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1> Issue Token </h1>
              <form onSubmit = {(event) => {
                event.preventDefault()
                const colors = this.colors.value
                this.mint(colors)
              }}>
                <input type=  'text' 
                  className = 'form-control mb-1' 
                  placeholder = 'e.g #FFFFFF'
                  ref={(input) => {this.colors = input}}
                  />
                  <input type='submit'
                    className='btn btn-block btn-primary'
                    value = 'Mint'
                    />
              </form>

                
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((colors, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{backgroundColor: colors}}></div>
                <div>{colors}</div>
              </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
