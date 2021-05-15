# senze-graphs

> React component library for d3-based graphs.

[![NPM](https://img.shields.io/npm/v/senze-graphs.svg)](https://www.npmjs.com/package/senze-graphs) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save senze-graphs
```

## Usage

```jsx
import React, { Component } from 'react';

import MyComponent from 'senze-graphs'

class Example extends Component {
  render() {
    return <MyComponent />;
  }
}
```

## License

MIT © [](https://github.com/)

## Setting Up Sonar Quality Gate

- Make sure that you have Java 11 or below (prefer Java11)
- Install Sonar Scanner connector node package:
  npm i sonar-scanner -D
- In your project directory, access file: node_modules/sonar-scanner/conf/sonar-scanner.properties.
  Add the following information:

  sonar.host.url=http://localhost:9000
  sonar.projectKey= piktorsense-graphs:sonar
  sonar.projectName= piktorsense-graphs
  sonar.projectVersion=1.0
  sonar.sources=src
  sonar.sourceEncoding=UTF-8
  sonar.language=js

- Terminal 1: Start Sonar Server :
  npm run sonar-server
- Terminal 2: Start Sonar Scanner :
  npm run sonar-scanner
