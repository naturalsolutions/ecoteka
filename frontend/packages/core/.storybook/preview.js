//Global file to add styling/decorators to all stories
//Needs to build again to apply changes

import React from 'react';

export const decorators = [
  (Story) => (
    <div>
      <Story />
    </div>
  ),
];