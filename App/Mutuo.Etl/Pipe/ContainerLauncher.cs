﻿using System;
using System.Threading;
using System.Threading.Tasks;
using Autofac;
using Serilog;

namespace Mutuo.Etl.Pipe {
  public interface IContainerLauncher {
    /// <summary>Runs the given container untill completion</summary>
    Task RunContainer(string containerName, string fullImageName, (string name, string value)[] envVars,
      string[] args, string groupName = null, ILogger log = null, CancellationToken cancel = default);
  }

  public class ContainerLauncher : IContainerLauncher {
    readonly PipeAppCfg Cfg;
    readonly IPipeCtx   Ctx;

    public ContainerLauncher(PipeAppCfg cfg, IPipeCtx ctx) {
      Cfg = cfg;
      Ctx = ctx;
    }

    public async Task RunContainer(string containerName, string fullImageName, (string name, string value)[] envVars, string[] args,
      string groupName = null,
      ILogger log = null,
      CancellationToken cancel = default) {
      IContainerLauncher launcher = Cfg.Location switch {
        PipeRunLocation.Container => Ctx.Scope.Resolve<AzureContainers>(),
        PipeRunLocation.LocalContainer => Ctx.Scope.Resolve<LocalPipeWorker>(),
        _ => throw new NotImplementedException()
      };
      await launcher.RunContainer(containerName, fullImageName, envVars, args, groupName);
    }
  }
}