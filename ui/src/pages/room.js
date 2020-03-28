import React from "react";
import { Link } from "react-router-dom";

import { PlayerList } from "shared";
import apiClient from "apiClient";
import { serviceUrls, roomRefreshDelay } from "constants.js";

export default class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoles: false,
      roomData: {
        players: [],
        you_are_moderator: null,
        assigned: null
      }
    };

    this.fetchRoomState();
  }
  fetchRoomState() {
    apiClient
      .get(serviceUrls.roomsPointed_.format(this.props.match.params.roomName))
      .then(response => {
        console.log("Fetched room state");
        this.setState({ roomData: response.data});
      })
      .catch(error => console.warn("Failed to fetch room state"));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.fetchRoomState(), roomRefreshDelay);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAction() {
    const {
      roomData: { you_are_moderator, assigned }
    } = this.state;

    if (you_are_moderator) {
      if (assigned) {
        return (
          <button
            className="big"
            
            onMouseDown={() => this.setState({ showRoles: true })}
            onTouchStart={() => this.setState({ showRoles: true })}

            onMouseUp={() => this.setState({ showRoles: false })}
            onTouchEnd={() => this.setState({ showRoles: false })}
          >
            Tap to view roles
          </button>
        );
      } else {
        return (
          <Link
            to={locationObj => locationObj.pathname + "/assign"}
            className="big"
          >
            Assign Roles
          </Link>
        );
      }
    } else {
      if (assigned) {
        return <button className="big">Tap to view your role</button>;
      } else {
        return (
          <button className="big" disabled={true}>
            Unassigned
          </button>
        );
      }
    }
  }
  render() {
    const {
      roomData: { players },
      showRoles
    } = this.state;
    return (
      <div className="actual-content">
        <div className="content-heading">Players</div>
        <PlayerList players={players} showRoles={showRoles} />
        <div className="button-container">{this.getAction()}</div>
      </div>
    );
  }
}
