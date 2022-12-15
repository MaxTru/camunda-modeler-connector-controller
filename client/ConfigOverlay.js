/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Overlay, Section } from 'camunda-modeler-plugin-helpers/components';

const OFFSET = { left: 0 };

// we can even use hooks to render into the application
export default function ConfigOverlay({ anchor, initValues, onClose }) {
  const [ enabled, setEnabled ] = useState(initValues.enabled);
  const [ connected, setConnected ] = useState(initValues.connected);
  const [ connectorEndpoint, setConnectorEndpoint ] = useState(initValues.connectorEndpoint);

  const onSubmit = () => onClose({ enabled, connectorEndpoint });

  if (!connected) {
    return (
      <Overlay anchor={ anchor } onClose={ onClose } offset={ OFFSET }>
        <Section>
          <Section.Header>Connector Controller - establish Connection</Section.Header>

          <Section.Body>
            <form id="connectorControllerForm">
              <div className="form-group">
                <label htmlFor="endpoint">Enter endpoint of your running Connectors.
                  This will allow you to retrieve status, and fetch connector templates.</label>
                <input
                  type="url"
                  className="form-control"
                  name="endpoint"
                  value={ connectorEndpoint }
                  onChange={ (event) =>
                    setConnectorEndpoint(event.target.value)
                  }
                />
              </div>
            </form>

            <Section.Actions>
              <button
                type="submit"
                className="btn btn-primary"
                form="connectorControllerForm"
                onClick={ () =>
                  setConnected(!connected)
                }
              >
                Control Connectors
              </button>
            </Section.Actions>
          </Section.Body>
        </Section>
      </Overlay>
    );
  } else {
    return (
      <Overlay anchor={ anchor } onClose={ onClose } offset={ OFFSET }>
        <Section>
          <Section.Header>Connector Controller - Controlcenter</Section.Header>

          <Section.Body>
            <ul>
              <li>Connector 1....</li>
              <li>Connector 2....</li>
            </ul>

            <Section.Actions>
              <button
                type="submit"
                className="btn btn-primary"
                form="connectorControllerForm"
                onClick={ () =>
                  setConnected(!connected)
                }
              >
                Disconnect
              </button>
            </Section.Actions>
          </Section.Body>
        </Section>
      </Overlay>
    );
  }
}

