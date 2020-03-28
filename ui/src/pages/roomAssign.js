import React from "react";
import apiClient from "apiClient";
import { serviceUrls } from "constants.js";

export default class RoomAssign extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignmentPending: false,
      assignmentComplete: false,
      assignmentError: null
    };
  }

  handleYes() {
    this.setState({ assignmentPending: true });
    apiClient
      .post(
        serviceUrls.roomsPointedAssign_.format(this.props.match.params.roomName)
      )
      .then(response => {
        console.log("This should be 2xx:", response.status)
        this.setState({ assignmentComplete: true, assignmentPending: false });
        setTimeout(() => this.props.history.goBack(), 2000);
      })
      .catch(error => {
        this.setState({ assignmentPending: false, assignmentError: error.response.data.message });
        setTimeout(() => this.props.history.goBack(), 2000);
      });
  }
  render() {
    const { assignmentComplete, assignmentPending, assignmentError } = this.state;
    if (assignmentPending) {
      return (
        <div className="content__body">
          <div className="actual-content">
            <div className="content-heading">
              Assigning roles to the players...
            </div>
          </div>
        </div>
      );
    }
    if (assignmentError) {
      return (
        <div className="content__body">
          <div className="actual-content">
            <div className="content-heading">
              Couldn't assign roles. The powers that be responded with: {assignmentError}
            </div>
          </div>
        </div>
      );
    }
    if (assignmentComplete) {
      return (
        <div className="content__body">
          <div className="actual-content">
            <div className="content-heading">
              Assignment done! Taking you back to the room...
            </div>
          </div>
        </div>
      );
    }
    if (!assignmentPending && !assignmentComplete)
      return (
        <div className="actual-content">
          <div className="content-heading">
            Are you sure you want to assign roles to this room?
          </div>
          <div className="button-container">
            <button onClick={() => this.handleYes()}>Yes</button>
            <button
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              No
            </button>
          </div>
        </div>
      );
  }
}
