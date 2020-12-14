/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */
export function ListChannels({ channels, operationType = 'publish' }) {
  const namesList = Object.entries(channels)
    .map(([channelName, channel]) => {
      if (
        (operationType === 'publish' && channel.hasPublish()) || 
        (operationType === 'subscribe' && channel.hasSubscribe())
      ) {
        return  `<li><strong>${channelName}</strong></li>`;
      }
    })
    .filter(Boolean);

  return `
<h2>
  Channels that you can ${operationType} to
</h2>
<hr />
<br />
<div class="container mx-auto px-8">
  <ul class="list-disc">${namesList.join('')}</ul>
</div>
`;
}
