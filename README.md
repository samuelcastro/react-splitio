# React Split

A Split.io library to easily manage splits in React.

## Get Started

- [Installation](#installation)
- [Usage](#usage)
- [Contributions](#install-dependencies)
- [All Available Scripts](#all-available-scripts)
- [TODO](#todo)

### Installation

#### Yarn

```console
samuelcastro@mac:~$ yarn add react-splitio
```

#### NPM

```console
samuelcastro@mac:~$ npm install react-splitio
```

## Usage

On your root component define the Split provider:

```jsx
<SplitProvider config={SDK_CONFIG_OBJECT}>
  <App />
</SplitProvider>
```

Now assuming you have a split named: `my-split` you can do something like:

```jsx
<Split name={'my-split'}>
  {(value: TreatmentWithConfig) =>
    value.treatment === 'on' ? this.renderComponent() : null
  }
</Split>
```

## Contributing

## Fork and Clone the Project

To start contributing first of all fork the project, to fork just click in the Fork button and then clone your own forked version of ProSight Connect.

```console
samuelcastro@mac:~$ git clone https://github.com/[YOUR_USER]/react-splitio.git
samuelcastro@mac:~$ cd react-splitio
samuelcastro@mac:~/react-splitio$
```

## Install Depedencies

On `react-splitio` install all dependencies running: `yarn` or `npm`

```console
samuelcastro@mac:~/react-splitio$ yarn
```

## Adding a commit to the Project

In order for create more organized and meaningful commits I'm using [commitizen](https://github.com/commitizen/cz-cli). Commitizen has been added as a dev dependancy.

To add a commit, you can run:

```console
samuelcastro@mac:~/react-splitio$ yarn commit or npm run commit
```

This command will run ts-lint and prettier to format your code if everything is ok.

## All Available Scripts

In the project directory, you can run:

### `yarn build`

Builds the app for production to the `build` folder.<br>
It uses Typescript [TSC](https://www.typescriptlang.org/docs/handbook/compiler-options.html) tool to compile files into CommonJS

### `yarn test`

Runs unit tests

### `yarn commit`

Utilizes commitizen to properly version the commit. While running the command you will be asked to classify the commit.

### `yarn tslint`, `yarn tslint:fix` and `yarn lint`

Run tslint.

### `yarn prettier:base` and 'yarn prettier:write`

Run prettier to format code.

### `yarn format`

Run prettier and lint auto fix

## `yarn install:local` and `install:local:all`

I'm using [Yalc](https://github.com/whitecolor/yalc) to manage local and custom npm packages. Yalc was developed to help us publish/install node modules without need to publish them on NPM, it's better and optmized option than yarn/npm link.

## `yarn update:local`

Update local custom node modules packages

## TODO

- Unit tests
- Use React Hooks rather than class components.
- Integrate [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) to automate the releasing process.
