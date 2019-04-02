import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';

class SaveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      isSaved: this.props.isSaved,
      email: this.props.email
    }
  }

  render() {
    return(
        <IconButton
          onClick={(event) => {
            if(this.state.isSaved) {
              this.props.deleteCourse(this.state.id, this.state.email);
            } else {
              this.props.saveCourse(this.state.id, this.state.email);
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
