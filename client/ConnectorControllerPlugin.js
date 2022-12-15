import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import classNames from 'classnames';

import Icon from '../resources/timer.svg';

import ConfigOverlay from './ConfigOverlay';

const defaultState = {
  enabled: false,
  connectorEndpoint: 'http://localhost:1234/connectors',
  connected: false,
  configOpen: false
};

/**
 * An example client extension plugin to enable auto saving functionality
 * into the Camunda Modeler
 */
export default class ConnectorControllerPlugin extends PureComponent {
  activeTab = {
    id: '__empty',
    type: 'empty'
  };

  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleConfigClosed = this.handleConfigClosed.bind(this);

    this._buttonRef = React.createRef();
  }

  componentDidMount() {

    /**
    * The component props include everything the Application offers plugins,
    * which includes:
    * - config: save and retrieve information to the local configuration
    * - subscribe: hook into application events, like <tab.saved>, <app.activeTabChanged> ...
    * - triggerAction: execute editor actions, like <save>, <open-diagram> ...
    * - log: log information into the Log panel
    * - displayNotification: show notifications inside the application
    */
    const {
      config,
      subscribe
    } = this.props;

    // retrieve plugin related information from the application configuration
    config.getForPlugin('connectorController', 'config')
      .then(config => this.setState(config));

    // subscribe to the event when the active tab changed in the application
    subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.activeTab = activeTab;
    });
  }

  componentDidUpdate() {
    const {
      configOpen,
      enabled
    } = this.state;

  }

  save() {
    const {
      displayNotification,
      triggerAction
    } = this.props;

    // trigger a tab save operation
    triggerAction('save')
      .then(tab => {
        if (!tab) {
          return displayNotification({ title: 'Failed to save' });
        }
      });
  }

  handleConfigClosed(newConfig) {
    this.setState({ configOpen: false });

    if (newConfig) {

      // via <config> it is also possible to save data into the application configuration
      this.props.config.setForPlugin('connectorController', 'config', newConfig)
        .catch(console.error);

      this.setState(newConfig);
    }
  }

  /**
   * render any React component you like to extend the existing
   * Camunda Modeler application UI
   */
  render() {
    const {
      configOpen,
      enabled,
      connectorEndpoint
    } = this.state;

    const initValues = {
      enabled,
      connectorEndpoint
    };

    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      <Fill slot="status-bar__file" group="9_connectorcontroller">
        <button
          ref={ this._buttonRef }
          className={ classNames('btn', { 'btn--active': configOpen }) }
          onClick={ () => this.setState({ configOpen: true }) }>
          <Icon />
        </button>
      </Fill>
      { this.state.configOpen && (
        <ConfigOverlay
          anchor={ this._buttonRef.current }
          onClose={ this.handleConfigClosed }
          initValues={ initValues }
        />
      )}
    </Fragment>;
  }
}
