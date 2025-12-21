# Contributing to My-resources

The [my-resources](/images/my-resources) feature allows users to customize their Exegol environment with personal configurations, tools, and scripts.

> [!IMPORTANT]
> It is very important to keep in mind the My-resources feature and what it supports depends on the image version, since it is the image that embeds the script that applies those custom configs at container creation. 

## Documentation

Any new feature or service added to my-resources must be documented in the following places:

1. Add a description in the [my-resources documentation](/images/my-resources)
2. Include examples and usage instructions
3. Document any dependencies or prerequisites
4. Add any relevant configuration options

## Code changes

The functionality is primarily managed through the `load_supported_setup.sh` script (located in the [Exegol-images](https://github.com/ThePorgs/Exegol-images) repo/submodule, at `/sources/assets/exegol/load_supported_setups.sh`). 

1. Fork the [Exegol-images](https://github.com/ThePorgs/Exegol-images) repository
2. Follow the [Installation Guide](/contribute/install) to set up your development environment
3. Checkout the `dev` branch
4. (optional) create a new branch in your fork, if you plan on working on different topics (`git checkout -b feat/your_feature`)
5. Create your content using this guide
6. Make sure your changes work locally
7. Stage, Commit, and Push your changes
8. Submit a Pull Request (https://github.com/ThePorgs/Exegol-images/compare)

Now back onto step 5, below are the standards you may follow when bringing your changes.

### Logging patterns

```bash
wrapper_verbose "Your message"  # For user-visible messages
logger_verbose "Your message"   # For log file only
```

| Logging function pair                       | Purpose                |
|---------------------------------------------|------------------------|
| `wrapper_info` / `logger_info`              | General information    |
| `wrapper_verbose` / `logger_verbose`        | Detailed information   |
| `wrapper_warning` / `logger_warning`        | Warning messages       |
| `wrapper_error` / `logger_error`            | Error messages         |
| `wrapper_success` / `logger_success`        | Success messages       |

### Code structure

```bash
function deploy_your_feature() {
    wrapper_verbose "Deploying your feature"
    
    # Check if feature directory exists
    if [[ -d "$MY_SETUP_PATH/your_feature" ]]; then
        # Handle existing setup
        logger_verbose "Processing existing setup"
        # Your code here
    else
        # Create new setup
        logger_verbose "Creating new setup"
        mkdir -p "$MY_SETUP_PATH/your_feature"
        # Your code here
    fi
}
```

### Standard paths

The following environment variables define important paths used when customizing my-resources:

| Variable         | Description                                 | Default path                |
|------------------|---------------------------------------------|-----------------------------|
| `$MY_ROOT_PATH`  | Root my-resources directory                 | `/opt/my-resources`         |
| `$MY_SETUP_PATH` | Setup directory for user customization      | `/opt/my-resources/setup`   |

### Error handling

```bash
if ! your_command; then
    wrapper_error "Failed to execute your_command"
    return 1
fi
```

Add your new function to the main execution flow in `load_supported_setup.sh`

## Testing your changes

Before submitting a pull request, test your my-resources changes locally with a locally built exegol image (see [wrapper/cli/build](/wrapper/cli/build)):

```bash
# Build the local image with your changes
exegol build "testimage" "full" --build-log "/tmp/exegol_testimage.log"
```

Set your changes, on your host, at `~/.exegol/my-resources/setup/YOUR_FEATURE`

```bash
# Create and start a container for the tests (my-resources is enabled by default) and increase the verbosity level to print my-resources
exegol start -v "testcontainer" "testimage"
```

Once inside the container, verify your my-resources setup:

```bash
# Check that the setup was applied correctly
# Verify your feature directory exists and files are in place
ls -la /opt/my-resources/setup/YOUR_FEATURE/

# Check the setup logs for any errors or warnings
cat /var/log/exegol/load_setups.log

# If the file extension is .log.gz, use zcat
zcat /var/log/exegol/load_setups.log.gz

# Test that your feature works as expected
```