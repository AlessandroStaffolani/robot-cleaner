import React, { Component } from "react";

export default class Alert extends Component {
    render() {
        const { value, type, dismissable } = this.props;
        let cssClassValue = "alert alert-" + type;
        cssClassValue += dismissable ? " alert-dismissible fade show" : "";

        return (
            <div className={cssClassValue} role="alert">
                {value}
                {dismissable ? (
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
