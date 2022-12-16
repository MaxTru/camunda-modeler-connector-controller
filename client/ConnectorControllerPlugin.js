import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import classNames from 'classnames';

import Icon from '../resources/timer.svg';

import ConfigOverlay from './ConfigOverlay';

const defaultState = {
  enabled: false,
  connectorEndpoint: 'http://localhost:9898/connectors',
  connected: false,
  configOpen: false,
};

const TAB_TYPE_BPMN = 'cloud-bpmn';

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

  handleConfigClosed(newConfig) {
    this.setState({ configOpen: false });

    if (newConfig) {

      // via <config> it is also possible to save data into the application configuration
      this.props.config.setForPlugin('connectorController', 'config', newConfig)
        .catch(console.error);

      this.setState(newConfig);
    }
  }

  addTemplate = async (template) => {
    const {
      config,
      displayNotification
    } = this.props;

    const elementTemplates = await config.get('elementTemplates') || [];

    if (!(elementTemplates.map(t => t.id)).includes(template.id)) {
      await this.setElementTemplates([
        ...elementTemplates,
        template
      ]);
    }

    displayNotification(
      {
        type: 'success',
        title: 'Connector Template Added',
        content: 'Have fun using the Connector!'
      }
    );
  }

  setElementTemplates = async elementTemplates => {
    const {
      config,
      triggerAction
    } = this.props;

    const activeTab = this.activeTab;

    await config.set('elementTemplates', elementTemplates);

    if (activeTab && activeTab.type === TAB_TYPE_BPMN) {
      triggerAction('elementTemplates.reload');
    }
  }

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
          onTemplateAdd={ this.addTemplate }
          initValues={ initValues }
        />
      )}
    </Fragment>;
  }
}
