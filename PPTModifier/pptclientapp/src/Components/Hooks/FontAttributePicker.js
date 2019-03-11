import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import request from "superagent";

//#region styles
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    // minWidth: 200,
    width: '10vw',
    minWidth: '100px'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '10vw',
    minWidth: '100px'
  },
  dense: {
    marginTop: theme.spacing.unit
  },
});
//#endregion

function FontAttributePicker(props) {
  const { classes } = props;
  const minFontSize = 1;
  const maxFontSize = 1000;
  const defaultFontSize = 12;
  const fontListRequest = request.get('/api/PowerPointTextModifier/GetAvailableFonts')

//#region state variable
  const [fontList, setFontList] = useState([]);
  const [fontName, setFontName] = useState('');
  const [fontNameLabelWidth, setFontNameLabelWidth] = useState(0);
  const [fontsizeErrorText, setFontsizeErrorText] = useState('');
//#endregion

  const [fontSize, setFontSize] = useState(defaultFontSize);
  const fontNameInputLabelRef = useRef(null);

  useEffect(() => {
    console.log('useEffect rendered')
    setFontNameLabelWidth(ReactDOM.findDOMNode(fontNameInputLabelRef.current).offsetWidth);
    
    //Fetch font list from server
    if(fontList.length === 0){
      console.log('Querying for fonts')
      fontListRequest.then(event => {
        if(event.ok){
          setFontList(event.body);
          setFontName(event.body[0].name);
          props.fontAttributesChanged({name: event.body[0].name, size: fontSize});
        }
      }).catch(err => {
        alert('Font provider appears to be offline');
      });
    }

  });
//#region event handler
  const handleFontNameChange = event => {
    setFontName(event.target.value);
    props.fontAttributesChanged({name: event.target.value, size: fontSize});
  };

  const sizeRegexValidator = /^[+]?\d+([.]\d+)?$/;
  const handleFontSizeChange = event => {
    if (event.target.value.match(sizeRegexValidator) && event.target.value >= minFontSize && event.target.value <= maxFontSize) {
      setFontsizeErrorText('');
      setFontSize(event.target.value);
      props.fontAttributesChanged({name: fontName, size: event.target.value});
    } else {
      setFontsizeErrorText(`Font size must be between ${minFontSize} and ${maxFontSize} inclusive`);
    }
  };

  //Suppress enter key
  const suppressEnterKey = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
//#endregion

  return (
    <form className={classes.root} autoComplete="off">
      {/* Font selector */}
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel
          ref={fontNameInputLabelRef}
        >
          Font
        </InputLabel>
        <Select
          value={fontName}
          onChange={handleFontNameChange}
          input={
            <OutlinedInput
              labelWidth={fontNameLabelWidth}
            />
          }
        > 
          {/* Using native elements here since material menuitems can be unresponsive when loading a lot of menu items */}
          {fontList.map((item, i) => (
            <div className={"selectItem"} key={'font-' + i} value={item.name}>
              <div  className={classes.selectItem} style={{fontFamily:item.name}}>{item.name}</div>
            </div>
          ))}
        </Select>
      </FormControl>

      {/* Font size selector */}
      <TextField
        label="Font Size"
        className={classNames(classes.textField, classes.dense)}
        variant="outlined"
        error = {fontsizeErrorText.length === 0 ? false : true }
        helperText={fontsizeErrorText}
        onChange={handleFontSizeChange}
        onKeyPress={suppressEnterKey}
        value={fontSize}
        inputProps={{
          style: { textAlign: "center" }
        }}
      />
    </form>
  );
}

FontAttributePicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FontAttributePicker);