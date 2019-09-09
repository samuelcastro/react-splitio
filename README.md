# React Split

A [Split.io](https://www.split.io/) library to easily manage splits in React.

## Get Started

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributions](#install-dependencies)
- [All Available Scripts](#all-available-scripts)
- [TODO](#todo)

## Installation

### Yarn

```console
samuelcastro@mac:~$ yarn add react-splitio
```

### NPM

```console
samuelcastro@mac:~$ npm install react-splitio
```

## Configuration

On your root component define the Split provider:

```jsx
<SplitProvider config={SDK_CONFIG_OBJECT}>
  <App />
</SplitProvider>
```

### Performance

Note that if your `SDK_CONFIG_OBJECT` is defined inside of a component it will create unnecessary work for `SplitProvider`,
because the object will have a different identity each render (`previousConfig !== newConfig`).

Instead define config outside of your component:

```tsx
const config = { ... };

const Root = () => (
  <SplitProvider config={config}>
    <App />
  </SplitProvider>
)
```

Or if you need to configure dynamically, memoize the object:

```tsx
const MySplitProvider = ({ trafficType, children }) => {
  const config = useMemo(
    () => ({
      core: {
        authorizationKey: '',
        trafficType,
      },
    }),
    [trafficType],
  );
  return <SplitProvider config={config}>{children}</SplitProvider>;
};
```

### Impression Listener

Split allows you to [implement a custom impression listener](https://help.split.io/hc/en-us/articles/360020564931-Node-js-SDK#listener).
`SplitProvider` has an optional convenience `onImpression` callback you can use instead.

```tsx
<SplitProvider config={} onImpression={impressionData => {
  // do something with the impression data.
}}>
```

## Usage

Now assuming you have a split named `feature1` you can do something like:

### Hook

```tsx
const [feature1, config] = useSplit('feature1');
if (feature1 === 'on') {
  return <Feature1 />;
}
```

Optional [attributes](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#attribute-syntax)
can also be passed in:

```tsx
const [feature1, config] = useSplit('feature1', { paying_customer: true });
```

### Component

```tsx
<Split name="feature1">
  {(value: TreatmentWithConfig) =>
    value.treatment === 'on' ? this.renderComponent() : null
  }
</Split>
```

You can optionally pass a list of splits:

```tsx
<Split name={['feature1', 'feature2']}>
  {(values: TreatmentsWithConfig) => {
    console.log(values);
    // {
    //  feature1: { treatment: 'on', config: null }
    //  feature2: { treatment: 'off', config: '{"bannerText":"Click here."}' }
    // }
    return something;
  }}
</Split>
```

And also, optional [attributes](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#attribute-syntax)
can also be passed in:

```tsx
<Split name='feature1' attributes={{ paying_customer: true }}>
  {(values: TreatmentsWithConfig) => {...}
</Split>
```

### Tracking

We have a `useTrack` hook which returns the a function with the same signature as
[`client.track`](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK#track).

```tsx
const track = useTrack();
function handleClick() {
  const queued = track('user', 'click', 'the_button', { foo: 'bar' });
}
```

## Contributing

### Fork and Clone the Project

To start contributing first of all fork the project, to fork just click in the Fork button and then clone your own forked version of react-splitio.

```console
samuelcastro@mac:~$ git clone https://github.com/[YOUR_USER]/react-splitio.git
samuelcastro@mac:~$ cd react-splitio
samuelcastro@mac:~/react-splitio$
```

### Install Depedencies

On `react-splitio` install all dependencies running: `yarn` or `npm`

```console
samuelcastro@mac:~/react-splitio$ yarn
```

### Adding a commit to the Project

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

### `yarn prettier:base` and `yarn prettier:write`

Run prettier to format code.

### `yarn format`

Run prettier and lint auto fix

### `yarn install:local` and `install:local:all`

I'm using [Yalc](https://github.com/whitecolor/yalc) to manage local and custom npm packages. Yalc was developed to help us publish/install node modules without need to publish them on NPM, it's better and optmized option than yarn/npm link.

### `yarn update:local`

Update local custom node modules packages

## TODO

- Unit tests
- Integrate [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) to automate the releasing process.
