import React, { Component } from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.state = {
      fetchImg: null,
      selectedImgs: null,
      downloadLoding:false
    };
  }
  componentDidMount() {
    this.fetchImgs();
  }
  fetchImgs() {
    let url = "https://pixabay.com/api/?key=12719776-1579c00651440801b78b8693d&q=people&image_type=photo";
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log("fetchImg=>", data.hits);
        this.setState({ fetchImg: data.hits });
      })
      .catch(error => {
        console.log(error);
      });
  };
  addImg = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
  // removeImg = (arr, item) => {
  //   arr = arr.filter((x) => x.id !== item.id);
  //   //return arr.push(item);
  // }
  handleCheckBox(e, img) {
    let arr = this.state.selectedImgs ? this.state.selectedImgs : [];
    if (e.target.checked) {
      // console.log('checked')
      this.addImg(arr, { "id": img.id, "size": img.imageSize, "url": img.largeImageURL });
      this.setState({ selectedImgs: arr });
      // console.log('arr=>',arr);
    } else {
      // console.log('not checked');
      let item = { "id": img.id, "size": img.imageSize, "url": img.largeImageURL };
      arr = arr.filter((x) => x.id !== item.id);
      this.setState({ selectedImgs: arr });
      // console.log('arr=>',arr);
    }
  }
  handleDownload(e) {
    e.preventDefault(); 
    let zip = new JSZip();
    let zipFilename = "distynet.zip";
    let selectedImgs = this.state.selectedImgs;  
    this.setState({downloadLoding:true});
    const urlToPromise = (url) => {
      return new Promise((resolve, reject)=>{
          JSZipUtils.getBinaryContent(url, (err, data) => {
              if(err) {
                  reject(err);
              } else {
                  resolve(data);
              }
          });
      });
  }; 
  selectedImgs.forEach((img)=>{
      let url = img.url;
      let filename = url.replace(/.*\//g, "");
      zip.file(filename, urlToPromise(url), {binary:true});
    });
    zip.generateAsync({type:"blob"})
    .then((blob)=> {
      saveAs(blob, zipFilename);
      this.setState({downloadLoding:false});         
  }, (err) => {
  });
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 id="heading">Multiple Download POC</h1>
          <p>POC for fetch downloadable <b>cache-url</b> from simple API call and creating <b>.zip</b> files with lovely JavaScript, and then download zip file in <b>browser</b>.</p>
        </header>
        <div id="backHome">
          <a href="/" className="button info">Refresh</a>
          {this.state.selectedImgs ?
            !this.state.downloadLoding ?
            <a href="/" className="button success" onClick={(e)=>this.handleDownload(e)}>Download</a>
            :
            <a  className="button ">Download Started!</a>
            
            : null}
        </div>
        <table border="1" id="tableContainer">
          <thead>
            <tr>
              <th>File Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="container">
            {this.state.fetchImg ?
              this.state.fetchImg.slice(0, 10).map((img, index) => (
                <tr key={index} >
                  <td><a href={img.pageURL} >{img.pageURL}</a></td>
                  <td align="center"><input type="checkbox" onChange={e => this.handleCheckBox(e, img)} /></td>
                </tr>
              ))
              :
              <tr>
                <td colSpan="3" align="center"> Fetching User Details</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
};

export default App;
