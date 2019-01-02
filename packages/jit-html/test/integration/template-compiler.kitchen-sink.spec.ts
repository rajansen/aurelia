import {
  IAttributeParser,
  ResourceModel
} from '@aurelia/jit';
import {
  Registration,
  RuntimeCompilationResources,
  Tracer,
  Writable
} from '@aurelia/kernel';
import {
  Aurelia,
  CustomElementResource,
  IDOM,
  IExpressionParser,
  ILifecycle,
  INodeSequence,
  ISignaler,
  LifecycleFlags,
  IRenderingEngine,
  IProjectorLocator,
  IObserverLocator,
  ITemplate,
  Binding,
  AccessScope,
  BindingMode,
  addBindable,
  If,
  CompositionCoordinator,
  Else,
  BindingContext,
  Scope
} from '@aurelia/runtime';
import {
  HTMLDOM
} from '@aurelia/runtime-html';
import { expect } from 'chai';
import {
  NodeSequenceFactory
} from '../../../runtime-html/src/dom';
import {
  HTMLJitConfiguration,
  stringifyTemplateDefinition,
  TemplateBinder
} from '../../src/index';
import {
  disableTracing,
  enableTracing,
  SymbolTraceWriter
} from '../unit/util';
import {
  AuDOMConfiguration, AuDOM, AuNode, AuNodeSequence
} from '../../../runtime/test/au-dom';
import { getVisibleText } from '../util';
import { defineCustomElement } from './util';
import { ViewFactory } from '../../../runtime/src/templating/view';
import { RuntimeBehavior } from '../../../runtime/src/rendering-engine';

const spec = 'template-compiler.kitchen-sink';

// TemplateCompiler - integration with various different parts
describe(spec, () => {
  it('startup with App type', () => {
    const component = CustomElementResource.define({ name: 'app', template: `<template>\${message}</template>` }, class { public message = 'Hello!'; });
    const host = document.createElement('div');
    const au = new Aurelia().register(HTMLJitConfiguration).app({ host, component }).start();
    expect(host.textContent).to.equal('Hello!');
    au.stop();
    expect(host.textContent).to.equal('');
    au.start();
    expect(host.textContent).to.equal('Hello!');
    au.stop();
    expect(host.textContent).to.equal('');
  });

  it('test', () => {
    const rows: any[] = [
      {
        show: true,
        prop1: { text1: 'p011', text2: 'p012' },
        prop2: { text1: 'p021', text2: 'p022' },
        prop3: { text1: 'p031', text2: 'p032' },
        prop4: { text1: 'p041', text2: 'p042' },
        prop5: { text1: 'p051', text2: 'p052' }
      },
      {
        show: true,
        prop1: { text1: 'p111', text2: 'p112' },
        prop2: { text1: 'p121', text2: 'p122' },
        prop3: { text1: 'p131', text2: 'p132' },
        prop4: { text1: 'p141', text2: 'p142' },
        prop5: { text1: 'p151', text2: 'p152' }
      },
      {
        show: true,
        prop1: { text1: 'p211', text2: 'p212' },
        prop2: { text1: 'p221', text2: 'p222' },
        prop3: { text1: 'p231', text2: 'p232' },
        prop4: { text1: 'p241', text2: 'p242' },
        prop5: { text1: 'p251', text2: 'p252' }
      },
      {
        show: true,
        prop1: { text1: 'p311', text2: 'p312' },
        prop2: { text1: 'p321', text2: 'p322' },
        prop3: { text1: 'p331', text2: 'p332' },
        prop4: { text1: 'p341', text2: 'p342' },
        prop5: { text1: 'p351', text2: 'p352' }
      },
      {
        show: true,
        prop1: { text1: 'p411', text2: 'p412' },
        prop2: { text1: 'p421', text2: 'p422' },
        prop3: { text1: 'p431', text2: 'p432' },
        prop4: { text1: 'p441', text2: 'p442' },
        prop5: { text1: 'p451', text2: 'p452' }
      },
      {
        show: true,
        prop1: { text1: 'p511', text2: 'p512' },
        prop2: { text1: 'p521', text2: 'p522' },
        prop3: { text1: 'p531', text2: 'p532' },
        prop4: { text1: 'p541', text2: 'p542' },
        prop5: { text1: 'p551', text2: 'p552' }
      },
    ];

    const cols: any[] = [
      { name: 'prop1', show: true },
      { name: 'prop2', show: true },
      { name: 'prop3', show: true },
      { name: 'prop4', show: true },
      { name: 'prop5', show: true }
    ];

    function getDisplayText() {
      let result = '';
      for (const row of rows) {
        for (const col of cols) {
          if (row.show && col.show) {
            result += row[col.name] && row[col.name].text1;
          } else {
            result += row[col.name] && row[col.name].text2;
          }
        }
      }
      return result;
    }

    const Col = CustomElementResource.define({
      name: 'col',
      template: `<template><template if.bind="row.show && col.show">\${row[col.name].text1}</template><template else>\${row[col.name].text2}</template></template>`
    },                                       class {
      public static bindables = { row: { property: 'row', attribute: 'row' }, col: { property: 'col', attribute: 'col' } };
      public row: any;
      public col: any;
      public created() {

      }
      public binding() {

      }
      public bound() {

      }
      public attaching() {

      }
      public attached() {

      }
      public detaching() {

      }
      public detached() {

      }
      public unbinding() {

      }
      public unbound() {

      }
    });

    const Row = CustomElementResource.define({
      name: 'row',
      template: `<template><col repeat.for="col of cols" col.bind="col" row.bind="row"></col></template>`
    },                                       class {
      public static bindables = { row: { property: 'row', attribute: 'row' }, cols: { property: 'cols', attribute: 'cols' } };
      public row: any;
      public cols: any[];
      public created() {

      }
      public binding() {

      }
      public bound() {

      }
      public attaching() {

      }
      public attached() {

      }
      public detaching() {

      }
      public detached() {

      }
      public unbinding() {

      }
      public unbound() {

      }
    });

    const CustomTable = CustomElementResource.define({
      name: 'custom-table',
      template: `<template><row repeat.for="row of rows" row.bind="row" cols.bind="cols"></row></template>`
    },                                               class {
      public static bindables = { rows: { property: 'rows', attribute: 'rows' }, cols: { property: 'cols', attribute: 'cols' } };
      public rows: any[];
      public cols: any[];
      public created() {

      }
      public binding() {

      }
      public bound() {

      }
      public attaching() {

      }
      public attached() {

      }
      public detaching() {

      }
      public detached() {

      }
      public unbinding() {

      }
      public unbound() {

      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><custom-table rows.bind="rows" cols.bind="cols"></custom-table></template>`
    },                                       class {
      public rows = rows;
      public cols = cols;
      public created() {

      }
      public binding() {

      }
      public bound() {

      }
      public attaching() {

      }
      public attached() {

      }
      public detaching() {

      }
      public detached() {

      }
      public unbinding() {

      }
      public unbound() {

      }
    });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Col, Row, CustomTable);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });
    au.start();

    const text1 = getDisplayText();
    expect(host.textContent).to.equal(text1);

    cols[0].show = false;
    cols[3].show = false;
    rows[2].show = false;
    rows[4].show = false;
    rows.push({
      show: true,
      prop1: { text1: 'p611', text2: 'p612' },
      prop2: { text1: 'p621', text2: 'p622' },
      prop3: { text1: 'p631', text2: 'p632' },
      prop4: { text1: 'p641', text2: 'p642' },
      prop5: { text1: 'p651', text2: 'p652' },
      prop6: { text1: 'p661', text2: 'p662' },
      prop7: { text1: 'p671', text2: 'p672' }
    });
    cols.push({ name: 'prop7', show: true });

    const text2 = getDisplayText();

    expect(host.textContent).to.equal(text1);

    lifecycle.processFlushQueue(LifecycleFlags.none);

    expect(host.textContent).to.equal(text2);

    au.stop();

    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal(text2);

  });

  it('attached task awaited indirectly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public attaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve();
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('');

    await Promise.resolve();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal('');

    await Promise.resolve();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');
  });

  it('attached task awaited directly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public attaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve();
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    lifecycle.beginAttach();
    au.start();
    let task = lifecycle.endAttach(LifecycleFlags.fromStartTask);

    expect(host.textContent).to.equal('');

    await task.wait();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');

    lifecycle.beginAttach();
    au.start();
    task = lifecycle.endAttach(LifecycleFlags.fromStartTask);

    expect(host.textContent).to.equal('');

    await task.wait();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');
  });

  it('attached task (triple then) awaited indirectly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public attaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve().then(() => {}).then(() => {}).then(() => {});
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('');

    await Promise.resolve();

    expect(host.textContent).to.equal('');

    await Promise.resolve();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal('');

    await Promise.resolve();

    expect(host.textContent).to.equal('');

    await Promise.resolve();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');
  });

  it('attached task (triple then) awaited directly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public attaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve().then(() => {}).then(() => {}).then(() => {});
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    lifecycle.beginAttach();
    au.start();
    let task = lifecycle.endAttach(LifecycleFlags.fromStartTask);

    expect(host.textContent).to.equal('');

    await task.wait();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');

    lifecycle.beginAttach();
    au.start();
    task = lifecycle.endAttach(LifecycleFlags.fromStartTask);

    expect(host.textContent).to.equal('');

    await task.wait();

    expect(host.textContent).to.equal('bar');

    au.stop();

    expect(host.textContent).to.equal('');
  });

  it('detached task awaited indirectly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public detaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve();
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await Promise.resolve();
    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await Promise.resolve();
    expect(host.textContent).to.equal('');

  });

  it('detached task awaited directly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public detaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve();
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    let task = lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await task.wait();
    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    task = lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await task.wait();
    expect(host.textContent).to.equal('');

  });

  it('detached task (triple then) awaited indirectly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public detaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve().then(() => {}).then(() => {}).then(() => {});
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await Promise.resolve();
    expect(host.textContent).to.equal('bar');
    await Promise.resolve();
    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await Promise.resolve();
    expect(host.textContent).to.equal('bar');
    await Promise.resolve();
    expect(host.textContent).to.equal('');
  });

  it('detached task (triple then) awaited directly', async () => {

    const Foo = CustomElementResource.define({
      name: 'foo',
      template: `<template><div ref="div">bar</div></template>`
    },                                       class {
      public $lifecycle: ILifecycle;
      public detaching() {
        this.$lifecycle.registerTask({
          done: false,
          canCancel() {return false; },
          cancel() {},
          wait() {
            this.done = true;
            return Promise.resolve().then(() => {}).then(() => {}).then(() => {});
          }
        });
      }
    });

    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><foo if.bind="true"></foo></template>`
    },                                       class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    let task = lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await task.wait();
    expect(host.textContent).to.equal('');

    au.start();

    expect(host.textContent).to.equal('bar');

    lifecycle.beginDetach();
    au.stop();
    task = lifecycle.endDetach(LifecycleFlags.fromStopTask);

    expect(host.textContent).to.equal('bar');
    await task.wait();
    expect(host.textContent).to.equal('');
  });

  it('signaler', async () => {

    const items = [0, 1, 2];
    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><div repeat.for="i of 3">\${items[i] & signal:'updateItem'}</div></template>`
    },                                       class {
      public items = items;
    });

    const container = HTMLJitConfiguration.createContainer();

    const signaler = container.get(ISignaler);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('012');

    items[0] = 2;

    lifecycle.processFlushQueue(LifecycleFlags.none);

    expect(host.textContent).to.equal('012');

    signaler.dispatchSignal('updateItem', LifecycleFlags.fromFlush);

    expect(host.textContent).to.equal('212');

  });

  it('signaler + oneTime', async () => {

    const items = [0, 1, 2];
    const App = CustomElementResource.define({
      name: 'app',
      template: `<template><div repeat.for="i of 3">\${items[i] & signal:'updateItem' & oneTime}</div></template>`
    },                                       class {
      public items = items;
    });

    const container = HTMLJitConfiguration.createContainer();

    const signaler = container.get(ISignaler);
    const lifecycle = container.get(ILifecycle);
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('012');

    items[0] = 2;

    lifecycle.processFlushQueue(LifecycleFlags.none);

    expect(host.textContent).to.equal('012');

    signaler.dispatchSignal('updateItem', LifecycleFlags.fromFlush);

    expect(host.textContent).to.equal('212');

  });

  it('render hook', async () => {

    const container = HTMLJitConfiguration.createContainer();
    const dom = new HTMLDOM(document);
    Registration.instance(IDOM, dom).register(container, IDOM);
    const App = CustomElementResource.define({
      name: 'app',
      template: `<template></template>`
    },                                       class {
      public $nodes: INodeSequence;
      public render() {
        this.$nodes = new NodeSequenceFactory(dom, 'foo').createNodeSequence();
      }
    });


    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('foo');

  });

  for (const [title, appMarkup, ceMarkup, appProp, ceProp, appValue, ceValue, target, expected] of [
    [
      `single, static`,
      `<div replace-part="bar">43</div>`,
      `<div replaceable part="bar">42</div>`,
      null,
      null,
      null,
      null,
      '',
      `43`
    ],
    [
      `multiple, static`,
      `<div replace-part="bar">43</div>`.repeat(2),
      `<div replaceable part="bar">42</div>`.repeat(2),
      null,
      null,
      null,
      null,
      '',
      `43`.repeat(2)
    ]
  ]) {
    it(`replaceable - ${title}`, () => {

      const App = defineCustomElement('app', `<template><foo>${appMarkup}</foo></template>`, class {});
      const Foo = defineCustomElement('foo', `<template>${ceMarkup}</template>`, class {});

      const container = HTMLJitConfiguration.createContainer();
      container.register(Foo);

      const au = new Aurelia(container);

      const host = document.createElement('div');
      const component = new App();

      au.app({ host, component });

      au.start();

      expect(host.textContent).to.equal(expected);

    });
  }

  it(`replaceable - bind to target scope`, () => {

    const App = defineCustomElement('app', `<template><foo><div replace-part="bar">\${baz}</div></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><div replaceable part="bar"></div></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abc');

  });

  it(`replaceable - bind to parent scope`, () => {

    const App = defineCustomElement('app', `<template><foo><div replace-part="bar">\${baz}</div></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><div replaceable part="bar"></div></template>`, class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('def');

  });

  it(`replaceable/template - bind to target scope`, () => {

    const App = defineCustomElement('app', `<template><foo><template replace-part="bar">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abc');

  });

  it(`replaceable/template - bind to parent scope`, () => {

    const App = defineCustomElement('app', `<template><foo><template replace-part="bar">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('def');

  });

  it(`replaceable/template - uses last on name conflict`, () => {

    const App = defineCustomElement('app', `<template><foo><template replace-part="bar">\${qux}</template><template replace-part="bar">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class {});

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('def');

  });

  it(`replaceable/template - same part multiple times`, () => {

    const App = defineCustomElement('app', `<template><foo><template replace-part="bar">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template><template replaceable part="bar"></template></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abcabc');

  });

  // TODO: fix this scenario
  xit(`replaceable/template - parent template controller`, () => {

    const App = defineCustomElement('app', `<template><foo><template if.bind="true"><template replace-part="bar">\${baz}</template></template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abc');

  });

  it(`replaceable/template - sibling lefthand side template controller`, () => {

    const App = defineCustomElement('app', `<template><foo><template if.bind="true" replace-part="bar">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abc');

  });

  it(`replaceable/template - sibling righthand side template controller`, () => {

    const App = defineCustomElement('app', `<template><foo><template replace-part="bar" if.bind="true">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abc');

  });

  it(`replaceable/template - sibling if/else with conflicting part names`, () => {

    const App = defineCustomElement('app', `<template><foo><template replace-part="bar" if.bind="true">\${baz}</template></foo><foo><template replace-part="bar" if.bind="false">\${baz}</template></foo></template>`, class { public baz = 'def'; });
    const Foo = defineCustomElement('foo', `<template><template replaceable part="bar"></template></template>`, class { public baz = 'abc'; });

    const container = HTMLJitConfiguration.createContainer();
    container.register(Foo);

    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('abc');

  });
});

describe('xml node compiler tests', () => {
  // TODO: add some content assertions and verify different kinds of xml compilation
  // (for now these tests are just to ensure the binder doesn't hang or crash when given "unusual" node types)
  const markups = [
    '<?xml?>',
    '<?xml version="1.0" encoding="utf-8"?>',
    '<?xml?>\n<a/>',
    '<?xml?>\n<a>\n\v<b/>\n</a>',
    '<?go there?>',
    '<?go there?><?come here?>',
    '<!-- \t Hello, World! \t -->',
    '<!-- \t Hello \t -->\n<!-- \t World \t -->',
    '<![CDATA[ \t <foo></bar> \t ]]>',
    '<![CDATA[ \t data]]><![CDATA[< > " and & \t ]]>',
    '<!DOCTYPE note [\n<!ENTITY foo "baa">]>',
    '<a/>',
    '<a/>\n<a/>',
    '<a/>\n<b/>',
    '<a x="hello"/>',
    '<a x="1.234" y="It\'s"/>',
    '<a> \t Hi \t </a>',
    '<a>  Hi \n There \t </a>',
    '<a>\n\v<b/>\n</a>',
    '<a>\n\v<b>\n\v\v<c/>\n\v</b>\n</a>'
  ];

  for (const markup of markups) {
    it(markup, () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(markup, 'application/xml');
      const fakeSurrogate = { firstChild: doc, attributes: [] };

      const container = HTMLJitConfiguration.createContainer();
      const resources = new ResourceModel(new RuntimeCompilationResources(container));
      const attrParser = container.get(IAttributeParser) as IAttributeParser;
      const exprParser = container.get(IExpressionParser) as IExpressionParser;
      const binder = new TemplateBinder(new HTMLDOM(document), resources, attrParser, exprParser);

      const result = binder.bind(fakeSurrogate as any);
      expect(result.physicalNode).to.equal(fakeSurrogate);
    });
  }
});

describe('dependency injection', () => {

  it('register local dependencies ', () => {
    const Foo = CustomElementResource.define(
      {
        name: 'foo',
        template: 'bar'
      },
      null
    );
    const App = CustomElementResource.define(
      {
        name: 'app',
        template: '<foo></foo>',
        dependencies: [Foo]
      },
      null
    );

    const container = HTMLJitConfiguration.createContainer();
    const au = new Aurelia(container);

    const host = document.createElement('div');
    const component = new App();

    au.app({ host, component });

    au.start();

    expect(host.textContent).to.equal('bar');
  });
});

describe('generated.template-compiler.static (with tracing)', function () {
  function setup() {
      enableTracing();
      Tracer.enableLiveLogging(SymbolTraceWriter);
      const container = HTMLJitConfiguration.createContainer();
      const au = new Aurelia(container);
      const host = document.createElement('div');
      return { au, host };
  }
  function verify(au, host, expected, description) {
      au.start();
      const outerHtmlAfterStart1 = host.outerHTML;
      expect(getVisibleText(au, host)).to.equal(expected, 'after start #1');
      au.stop();
      const outerHtmlAfterStop1 = host.outerHTML;
      expect(getVisibleText(au, host)).to.equal('', 'after stop #1');
      au.start();
      const outerHtmlAfterStart2 = host.outerHTML;
      expect(getVisibleText(au, host)).to.equal(expected, 'after start #2');
      au.stop();
      const outerHtmlAfterStop2 = host.outerHTML;
      expect(getVisibleText(au, host)).to.equal('', 'after stop #2');
      expect(outerHtmlAfterStart1).to.equal(outerHtmlAfterStart2, 'outerHTML after start #1 / #2');
      expect(outerHtmlAfterStop1).to.equal(outerHtmlAfterStop2, 'outerHTML after stop #1 / #2');

      console.log('\n' + stringifyTemplateDefinition(description, 0));
      disableTracing();
  }
  it('tag$01 text$01 _', function () {
      const { au, host } = setup();
      const App = CustomElementResource.define({ name: 'app', template: '<template><div>a</div></template>' }, class {
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$01 text$03 _', function () {
      const { au, host } = setup();
      const App = CustomElementResource.define({ name: 'app', template: '<template><div>${msg}</div></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$02 text$01 _', function () {
      const { au, host } = setup();
      const App = CustomElementResource.define({ name: 'app', template: '<template>a</template>' }, class {
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$02 text$03 _', function () {
      const { au, host } = setup();
      const App = CustomElementResource.define({ name: 'app', template: '<template>${msg}</template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$03 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template>${msg}</template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$04 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template><template replaceable part="part1"></template><template replaceable part="part2"></template></template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"><template replace-part="part1">${msg}</template></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$05 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template>${msg}</template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public static containerless = true;
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$06 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template><template replaceable part="part1"></template><template replaceable part="part2"></template></template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public static containerless = true;
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"><template replace-part="part1">${msg}</template></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$07 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template>${msg}</template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public static shadowOptions = { mode: 'open' };
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$08 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template><template replaceable part="part1"></template><template replaceable part="part2"></template></template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public static shadowOptions = { mode: 'open' };
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"><template replace-part="part1">${msg}</template></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$09 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template>${msg}</template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public static shadowOptions = { mode: 'closed' };
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
  it('tag$10 text$03 _', function () {
      const { au, host } = setup();
      const MyFoo = CustomElementResource.define({ name: 'my-foo', template: '<template><template replaceable part="part1"></template><template replaceable part="part2"></template></template>' }, class {
          public static bindables = { msg: { property: 'msg', attribute: 'msg' }, not: { property: 'not', attribute: 'not' }, item: { property: 'item', attribute: 'item' } };
          public static shadowOptions = { mode: 'closed' };
          public msg = '';
          public not = '';
          public item = '';
      });
      au.register(MyFoo);
      const App = CustomElementResource.define({ name: 'app', template: '<template><my-foo msg.bind="msg"><template replace-part="part1">${msg}</template></my-foo></template>' }, class {
          public msg = 'a';
      });
      const component = new App();
      au.app({ host, component });
      verify(au, host, 'a', App.description);
  });
});

// commented out code left here intentionally, serves as a staring point for template controller tests

// describe.only('test', () => {
//   it.only('if', () => {
//     enableTracing();
//     Tracer.enableLiveLogging(SymbolTraceWriter);
//     const container = HTMLJitConfiguration.createContainer();
//     const dom = new HTMLDOM(document);
//     Registration.instance(IDOM, dom).register(container, IDOM);
//     const host = document.createElement('div');
//     const hosthost = document.createElement('div');
//     hosthost.appendChild(host);
//     const App = CustomElementResource.define(
//       {
//         name: 'app',
//         template: '<div if.bind="value">${ifText}</div><div else>${elseText}</div>'
//       },
//       class {
//         ifText = 'foo';
//         elseText = 'bar';
//       }
//     );
//     const component = new App();

//     const lifecycle = container.get(ILifecycle);
//     const re = container.get(IRenderingEngine);
//     const pl = container.get(IProjectorLocator);

//     component.$hydrate(dom, pl, re, host, null);

//     component['value'] = false;
//     component.$bind(LifecycleFlags.none);

//     component['value'] = true;

//     component.$bind(LifecycleFlags.none);

//     component.$attach(LifecycleFlags.none);

//     disableTracing();
//     expect(host.textContent).to.equal('bar')
//   });

//   it.only('if2', () => {
//     enableTracing();
//     Tracer.enableLiveLogging(SymbolTraceWriter);
//     // common stuff
//     const container = AuDOMConfiguration.createContainer();
//     const dom = container.get<AuDOM>(IDOM);
//     const observerLocator = container.get(IObserverLocator);
//     const lifecycle = container.get(ILifecycle);

//     const location = AuNode.createRenderLocation();
//     const host = AuNode.createHost().appendChild(location.$start).appendChild(location);

//     const ifPropName = 'ifValue';
//     const elsePropName = 'elseValue';
//     const ifText = 'foo';
//     const elseText = 'bar';

//     const ifTemplate: ITemplate<AuNode> = {
//       renderContext: null as any,
//       dom: null as any,
//       render(renderable) {
//         const text = AuNode.createText();
//         const wrapper = AuNode.createTemplate().appendChild(text);

//         const nodes = new AuNodeSequence(dom, wrapper);
//         const binding = new Binding(new AccessScope(ifPropName), text, 'textContent', BindingMode.toView, observerLocator, container);

//         (renderable as Writable<typeof renderable>).$nodes = nodes;
//         addBindable(renderable, binding);
//       }
//     };

//     const elseTemplate: ITemplate<AuNode> = {
//       renderContext: null as any,
//       dom: null as any,
//       render(renderable) {
//         const text = AuNode.createText();
//         const wrapper = AuNode.createTemplate().appendChild(text);

//         const nodes = new AuNodeSequence(dom, wrapper);
//         const binding = new Binding(new AccessScope(elsePropName), text, 'textContent', BindingMode.toView, observerLocator, container);

//         (renderable as Writable<typeof renderable>).$nodes = nodes;
//         addBindable(renderable, binding);
//       }
//     };

//     //@ts-ignore
//     const ifFactory = new ViewFactory<AuNode>('if-view', ifTemplate, lifecycle);
//     //@ts-ignore
//     const elseFactory = new ViewFactory<AuNode>('else-view', elseTemplate, lifecycle);

//     const sut = new If<AuNode>(ifFactory, location, new CompositionCoordinator(lifecycle));
//     const elseSut = new Else<AuNode>(elseFactory);
//     elseSut.link(sut);

//     (sut as Writable<If>).$scope = null;
//     (elseSut as Writable<Else>).$scope = null;

//     //@ts-ignore
//     const ifBehavior = RuntimeBehavior.create(If);
//     //@ts-ignore
//     ifBehavior.applyTo(sut, lifecycle);

//     //@ts-ignore
//     const elseBehavior = RuntimeBehavior.create(Else);
//     //@ts-ignore
//     elseBehavior.applyTo(elseSut, lifecycle);


//     let firstBindInitialNodesText: string;
//     let firstBindFinalNodesText: string;
//     let secondBindInitialHostsText: string;
//     let secondBindFinalNodesText: string;
//     let firstAttachInitialHostText: string = 'foo';
//     let firstAttachFinalHostText: string;
//     let secondAttachInitialHostText: string;
//     let secondAttachFinalHostText: string;

//     // -- Round 1 --

//     const ctx = BindingContext.create({
//       [ifPropName]: ifText,
//       [elsePropName]: elseText
//     });
//     let scope = Scope.create(ctx);

//     sut.value = false;

//     sut.$bind(LifecycleFlags.none, scope);
//     if (false) {
//       scope = Scope.create(ctx);
//     }
//     sut.value = true;
//     sut.$bind(LifecycleFlags.none, scope);

//     sut.$attach(LifecycleFlags.none);

//     expect(host.textContent).to.equal(firstAttachInitialHostText, 'host.textContent #1');
//     disableTracing();

//   });
// });
