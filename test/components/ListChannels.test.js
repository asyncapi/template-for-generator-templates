import { render } from '@asyncapi/generator-react-sdk';

import { ListChannels } from '../../components/ListChannels';
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

describe('ListChannels', () => {
  const asyncapi = new AsyncAPIDocument({
    asyncapi: '2.2.0',
    info: {
      title: 'Streetlights Kafka API',
      version: '1.0.0',
      description: 'The Smartylighting Streetlights API allows you to remotely manage the city lights.\n\n### Check out its awesome features:\n\n* Turn a specific streetlight on/off 🌃\n* Dim a specific streetlight 😎\n* Receive real-time information about environmental lighting conditions 📈\n',
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0'
      }
    },
    channels: {
      'smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured': {
        description: 'The topic on which measured values may be produced and consumed.',
        publish: {
          summary: 'Inform about environmental lighting conditions of a particular streetlight.',
          operationId: 'receiveLightMeasurement',
          message: {
            $ref: '#/components/messages/lightMeasured'
          }
        }
      },
      'smartylighting.streetlights.1.0.action.{streetlightId}.turn.on': {
        subscribe: {
          operationId: 'turnOn',
          message: {
            $ref: '#/components/messages/turnOnOff'
          }
        }
      },
      'smartylighting.streetlights.1.0.action.{streetlightId}.turn.off': {
        subscribe: {
          operationId: 'turnOff',
          message: {
            $ref: '#/components/messages/turnOnOff'
          }
        }
      },
      'smartylighting.streetlights.1.0.action.{streetlightId}.dim': {
        subscribe: {
          operationId: 'dimLight',
          message: {
            $ref: '#/components/messages/dimLight'
          }
        }
      }
    },
  });

  it('should render all names of publish operations', () => {
    const expected = `
<h2>
  Channels that you can publish to
</h2>
<hr />
<br />
<div class="container mx-auto px-8">
  <ul class="list-disc"><li><strong>smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured</strong></li></ul>
</div>
`;
    
    const result = render(<ListChannels channels={asyncapi.channels()} operationType='publish' />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render all names of subscribe operations', () => {
    const expected = `
<h2>
  Channels that you can subscribe to
</h2>
<hr />
<br />
<div class="container mx-auto px-8">
  <ul class="list-disc"><li><strong>smartylighting.streetlights.1.0.action.{streetlightId}.turn.on</strong></li><li><strong>smartylighting.streetlights.1.0.action.{streetlightId}.turn.off</strong></li><li><strong>smartylighting.streetlights.1.0.action.{streetlightId}.dim</strong></li></ul>
</div>
`;
    
    const result = render(<ListChannels channels={asyncapi.channels()} operationType='subscribe' />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
