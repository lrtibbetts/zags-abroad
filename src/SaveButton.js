import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaved: this.props.isSaved
    }
  }

  render() {
    return(
        <IconButton
          onClick={(event) => {
            console.log(this.props.id);
            if(this.state.isSaved) {
              this.props.deleteCourse(this.props.id, this.props.email);
            } else {
              this.props.saveCourse(this.props.id, this.props.email);
            }
            this.setState({ isSaved: !this.state.isSaved });
          }}>
          { this.state.isSaved ?
            <DoneIcon color="primary" /> :
            <AddIcon color="primary" /> }
        </IconButton>
    );
  }
}

export default SaveButton;
