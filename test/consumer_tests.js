import Oasis from "oasis";
import { commonTests } from "test/helpers/suite";

commonTests('Consumer', function (oasis, adapter) {
  test("Consumers instances are saved on the Oasis global", function() {
    expect(1);
    stop();

    oasis.register({
      url: "fixtures/consumer.js",
      capabilities: ['assertions']
    });

    var AssertionsService = Oasis.Service.extend({
      events: {
        ok: function() {
          start();
          ok(true, "Consumer was accessed");
        }
      }
    });

    var sandbox = oasis.createSandbox({
      url: 'fixtures/consumer.js',
      services: {
        assertions: AssertionsService
      }
    });

    sandbox.start();
  });

  test("Consumers do not process events until connect() has been called", function() {
    expect(1);
    oasis.register({
      url: 'fixtures/delayed_connect.js',
      capabilities: ['assertions']
    });

    stop();

    var AssertionsService = Oasis.Service.extend({
      initialize: function(port) {
        port.send('ping');
      },

      events: {
        pong: function() {
          start();
          ok(true, "The child card acknowledged the ping");
        }
      }
    });

    var sandbox = oasis.createSandbox({
      url: 'fixtures/delayed_connect.js',
      services: {
        assertions: AssertionsService
      }
    });

    sandbox.start();
  });
});
