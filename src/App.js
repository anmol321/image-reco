import React,{Component} from 'react';
import './App.css';

import Navigation from './Components/Navigation/Navigation.js';
import ImageLinkerForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';




const particlesOptions = {
  particles: {
    number :{
      value:106,
      density:{
        enable:true,
        value_area:641
      }
    }
  },
  interactivity: {
    onhover:{
      enable:true,
      mode:"bubble",
    
    }
  }

}

const initialState = {
  input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:'',
      user:{
        id:'',
        name:'',
        email:'',
        password:'',
        entries:0,
        joined:''
      }
  
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  loadUser = (data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
    }})
  }
  

  calculateFaceLocation = (data)=>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol:clarifaiFace.left_col * width,
      topRow:clarifaiFace.top_row * height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height)
    }
    // console.log(clarifaiFace)
    // console.log(data);
  }

  displayFaceBox = (box)=>{
    // console.log(box);
    this.setState({box})
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value})
  }


  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input});
    fetch('http://localhost:3000/imageUrl',{
      method:'post',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        input:this.state.input
      })
    }).then(response=>response.json())
    .then(
    (response)=>{
      if(response) {
        fetch('http://localhost:3000/image',{
          method:'put',
          headers:{'Content-type':'application/json'},
          body:JSON.stringify({
            id:this.state.user.id
          })
        }).then(response=>response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err=>console.log(err));

  }

  onRouteChange = (route)=>{
    if(route==='signout') {
      this.setState(initialState)
    } else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  render() {
    return (
      <div className="App">
      <Particles className='particles'
              params={particlesOptions}
      />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        {this.state.route==='home'?
        <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkerForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        :
        (
          this.state.route==='signin'?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>:
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )  
        }
        
      </div>
    )
  }
  
}

export default App;
