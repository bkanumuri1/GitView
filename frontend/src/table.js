import React from "react";
import { Component } from "react";
import gitData from "./git";

class MyTable extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedRows: [] };
  }

  handleExpand = gitInfo => {
    let newExpandedRows = [...this.state.expandedRows];
    let allExpanded = this.state.allExpanded;
    let idxFound = newExpandedRows.findIndex(id => {
      return id === gitInfo.id;
    });

    if (idxFound > -1) {
      console.log("Collapsing " + gitInfo.date + " " + idxFound);
      newExpandedRows.splice(idxFound, 1);
    } else {
      console.log("Expanding " + gitInfo.date);
      newExpandedRows.push(gitInfo.id);
    }

    console.log("Expanded rows");
    console.log(newExpandedRows);

    this.setState({ expandedRows: [...newExpandedRows] });
  };

  isExpanded = gitInfo => {
    const idx = this.state.expandedRows.find(id => {
      return id === gitInfo.id;
    });

    return idx > -1;
  };

  expandAll = gitData => {
    console.log("ExapndedRows: " + this.state.expandedRows.length);
    console.log("gitData:      " + gitData.length);
    if (this.state.expandedRows.length === gitData.length) {
      let newExpandedRows = [];
      this.setState({ expandedRows: [...newExpandedRows] });
      console.log("Collapsing all...");
    } else {
      let newExpandedRows = gitData.map(gitInfo => gitInfo.id);
      this.setState({ expandedRows: [...newExpandedRows] });
      console.log("Expanding all...");
      console.log("Expanded rows " + newExpandedRows.length);
    }
  };

  getRows = gitInfo => {
    let rows = [];
    const projects = gitInfo.projects || [];

    const firstRow = (
      <tr>
        <td>{gitInfo.date}</td>
        <td>{gitInfo.commits}</td>
        <td>{gitInfo.additions}</td>
        <td>{gitInfo.deletions}</td>
        <td>
          {projects.length > 0 && (
            <button onClick={() => this.handleExpand(gitInfo)}>
              {this.isExpanded(gitInfo) ? "-" : "+"}
            </button>
          )}
        </td>
      </tr>
    );

    rows.push(firstRow);

    if (this.isExpanded(gitInfo) && projects.length > 0) {
      const projectRows = projects.map(project => (
        <tr className="gitInfo-details">
          <td className="gitInfo-details" />
          <td colspan="3" className="gitInfo-details">
            <br />
            <div className="attribute">
              <div className="attribute-name">Toggle Here: </div>
              <div className="attribute-value">{project.name}</div>
            </div>
            <br />
          </td>
        </tr>
      ));

      rows.push(projectRows);
    }

    return rows;
  };

  getPlayerTable = gitData => {
    const playerRows = gitData.map(gitInfo => {
      return this.getRows(gitInfo);
    });

    return (
      <table className="table">
        <tr>
          <th>Date</th>
          <th>Commits</th>
          <th>Additions</th>
          <th>Deletions</th>
          <th onClick={() => this.expandAll(gitData)}>
            <button>
              {gitData.length === this.state.expandedRows.length ? "-" : "+"}
            </button>
          </th>
        </tr>
        {playerRows}
      </table>
    );
  };

  render() {
    return <div>{this.getPlayerTable(gitData)}</div>;
  }
}

export default MyTable;
