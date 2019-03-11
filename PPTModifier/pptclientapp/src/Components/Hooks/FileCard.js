import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//#region styles
const styles = theme => ({
    card: {
        minWidth: 275,
        maxWidth: 500,
        minHeight:200,
        },
    title: {
        fontSize: 14,
    },
    controls:{
        display: 'flex',
        alignItems: 'center'
    },
    button:{
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
});
//#endregion

function FileCard(props) {
  const { classes } = props;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
        {"Click upload to update font of the powerpoint file"}
        </Typography>
        <FontAwesomeIcon icon="file-powerpoint" size="10x"/>
        <Typography className={classes.pos} color="textSecondary">
          {props.selectedFileName}
        </Typography>
      </CardContent>
      <Button variant="contained" color="primary" className={classes.button} onClick={props.onUploadClicked}>
        <FontAwesomeIcon icon="upload" />&nbsp;Upload
      </Button>
      <Button variant="contained" color="secondary" className={classes.button} onClick={props.onCancelClicked}>
        <FontAwesomeIcon icon="trash" />&nbsp;Cancel
      </Button>
    </Card>
  );
}

FileCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileCard);