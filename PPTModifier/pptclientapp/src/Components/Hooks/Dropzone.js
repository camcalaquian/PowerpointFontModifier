import React, {useState, useRef, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import request from "superagent";
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileCard from 'Components/Hooks/FileCard';
import Typography from '@material-ui/core/Typography';
import FontAttributePicker from 'Components/Hooks/FontAttributePicker';
import classNames from 'classnames';
import Slide from '@material-ui/core/Slide';

//#region styles
const styles = {
  container: {
    borderStyle: 'dashed',
    borderColor: '194D33',
    borderRadius: '5px',
    borderWidth: '2px',
    position: 'relative',
    marginTop: '20px',
    marginRight: '20px',
    marginLeft: '20px',
    maxWidth:'1000px',
    minWidth:'600px',
    backgroundImage: 'linear-gradient(77.38250976449251deg, rgba(87, 123, 148,0.5) 20.220052083333332%,rgba(86, 124, 146,0.5) 20.509440104166668%,rgba(0, 237, 24,0.20125786163522014) 66.52213541666667%,rgba(0, 237, 24,0.2) 66.52213541666667%)'
  },
  dropzone:{
    minHeight: '300px',
    outline: 'none'
  },
  filecard:{
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5px',
  },
  center:{
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    height: '30%',
    margin: 'auto'
  },
  fontattributepicker:{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  downloadlink:{
    display: 'none'
  }
};
//#endregion

function Dropzone(props) {
  const { classes } = props;
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fontAttributes, setFontAttributes] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const downloadLinkRef = useRef(null);
  const onDrop = (files) => {
    setIsFileSelected(true);
  }
  //POST file to web API for processing
  const onUploadClicked = () => {
    const req = request.post('/api/PowerPointTextModifier/ModifyFontAttribute');
    setProgress(0);
    setIsUploading(true);
    setIsProcessing(false);
    setIsFileSelected(false);

    req.attach('file', acceptedFiles[0])
     .field('fontName', fontAttributes.name)
     .field('fontSize', fontAttributes.size)
    .on('progress', event => {
      //Updates the loading bar according to the percentage of uploaded file.
      setProgress(Math.floor(event.percent/5)*5);
      if(event.percent === 100){
        onFileUploaded();
      }
    })
    .on('error', errorHandler)
    .then(onFileProcessed);
  }

  //Error handler for POST request 
  const errorHandler = (err, res) =>{
    if (err && err.status === 404) {
      alert('Service is offline');
    }
    else if (err) {
      alert('An error occurred, make sure your file is valid');
    }
    setIsUploading(false);
    setIsProcessing(false);
  }

  //Hide the file card
  const onCancelClicked = () => {
    setIsFileSelected(false);
  }

  //Show upload progress bar and processing text
  const onFileUploaded = () => {
    setIsProcessing(true);
  }

  //When processing of file is complete
  const onFileProcessed = (res) => {
    if(res.ok){
      setDownloadLink(res.text);
      setTimeout(()=>downloadLinkRef.current.click(), 200);
    }
    else{
      alert('An error occurred, make sure your file is valid');
    }
    setIsUploading(false);
    setIsProcessing(false);
  }

  //Get values for use by parent
  const updateFontValues = (data) => {
    console.log('updated font values');
    setFontAttributes({name: data.name, size: data.size});
  }

  //Dropzone settings
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    onDrop: onDrop,
    disabled: isFileSelected,
    accept: 'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    multiple: false
  })

  return (
    <div>
      <div className={classes.container}>
        <div {...getRootProps()} className={classes.dropzone}>
          {(!isProcessing && !isFileSelected) && <div className={classNames(classes.center, classes.instruction)}><input {...getInputProps()} />
          <div>Drag 'n' drop some files here, or click to select files</div>
          <div>Only *.ppt and *.pptx will be accepted</div></div>}
          {isProcessing &&  <div className={classes.center}><CircularProgress/><Typography color="textSecondary" gutterBottom>Processing File...</Typography></div>}
          <Slide direction="up" in={isFileSelected} mountOnEnter unmountOnExit>
            <div className={classes.filecard}>
              <FileCard onUploadClicked={onUploadClicked} onCancelClicked={onCancelClicked} selectedFileName={isFileSelected ? acceptedFiles[0].name : ''}/>
            </div>
          </Slide>
        </div>
        {isUploading && <LinearProgress color="primary" variant="determinate" value={progress}/> }
      </div>
      <div className={classes.fontattributepicker}>
        <FontAttributePicker fontAttributesChanged={updateFontValues}/>
      </div>

      <aside>
        <a href={downloadLink} download="output.pptx" ref={downloadLinkRef} className={classes.downloadlink}>Download link</a>
      </aside>
    </div>
  )
}
export default withStyles(styles)(Dropzone);