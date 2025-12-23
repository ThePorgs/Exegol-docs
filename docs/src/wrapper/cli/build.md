# `build` action

The `build` action allows you to build an Exegol image locally from source. This is useful when you want to customize the image or when you need to build for a specific architecture.

When building an image, you can either:
- Use the default Exegol build profiles
- Use custom Dockerfiles

> [!WARNING] Build Reliability
>
> Building Exegol images locally can be challenging. It's a long process, and may fail due to:
> - Regular updates and changes in the tools and dependencies
> - Incompatibilities between different versions of tools
> - Network issues during the build process
> - System-specific requirements and configurations
>
> We strongly recommend using pre-built images (`exegol install`) unless you have a specific need to build locally.

## Build Process

1. Choose a name for your image (if not specified in command)
2. Choose a profile (if not specified in command)
3. The build process will start

## Options

| Option | Description |
|--------|-------------|
| `IMAGE` | Tag used to target an Exegol image |
| `BUILD_PROFILE` | Select the build profile used to create a local image |
| `--build-log LOGFILE_PATH` | Write image building logs to a file |
| `--build-path DOCKERFILES_PATH` | Path to the dockerfiles and sources |

## Command examples

```bash
# Build interactively an exegol image
exegol build

# Build interactively a local image named myimage
exegol build myimage

# Build the myimage image based on the full profile and log the operation
exegol build myimage full --build-log /tmp/build.log
```

## Cross-architecture builds

While the `--arch` parameter is supported, cross-architecture builds are not recommended because:
- They may require additional setup (QEMU, Docker buildx)
- They are significantly slower due to emulation
- Some tools may have architecture-specific dependencies

If you need to build for a different architecture, consider using a native system of that architecture instead.