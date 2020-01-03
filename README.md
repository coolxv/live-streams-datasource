# Live Streams Data Source

Refference: https://circleci.com/gh/grafana/simple-datasource/tree/master

This is a stub to show how to create a live streams data source plugin.

# Problems

grafana 6.5.2版本对推流支持的还不完善，当前面板被删除时或者离开仪表盘时没有触发rxjs的Observable unsubscribe操作。

问题单grafana： https://github.com/grafana/grafana/issues/21299

rxjs 6.4.0 的Observable 不同创造方式存在Symbol(observable) 或者 @@observable导致判断是否为Observable有问题

问题单rxjs： https://github.com/ReactiveX/rxjs/issues/5195
