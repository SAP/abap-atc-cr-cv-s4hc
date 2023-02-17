# S/4 HANA Cloud - Released objects for ATC Check (Cloudification Repository)

[![REUSE status](https://api.reuse.software/badge/github.com/SAP/abap-atc-cr-cv-s4hc)](https://api.reuse.software/info/github.com/SAP/abap-atc-cr-cv-s4hc)

The repository contains the list of released APIs of S/4HANA Cloud. In addition also the objects that are not released are contained with the specification of successor objects. All objects are contained in one JSON file. This file is used as content for the ABAP Test Cockpit Check "Usage of Released APIs (Cloudification Repository)". This check can be used by customers and partners to analyse existing custom code concerning the usage of released and not released APIs on all ECC and S/4HANA releases. The check is available in SAP BTP, ABAP environment.

## Requirements

Please implement note "ATC Check for Github Repo: https://launchpad.support.sap.com/#/notes/3284711

## Download and Installation

1. Activate in your ATC check variant the check "Cloud Readiness" -> Usage of Released APIs (Cloudification Repository)

2. In the attributes of the check enter the URL to this git repository https://github.com/SAP/abap-atc-cr-cv-s4hc/blob/main/src/objectReleaseInfoLatest.json

Optional: use another json file with a different content. For S/4 HANA Cloud, public edition please use always the current file objectReleaseInfoLatest.json
For S/4 HANA Cloud, private edition or on-premise, you can use the release version file with the string *PCE* included.

## How to obtain support

This project is provided "as-is", with no expected changes or support. Of course you can always report bugs via GitHub issues.
Request for new APIs please use the corresponding CI channel https://influence.sap.com/sap/ino/#campaign/2759 or get details in note https://launchpad.support.sap.com/#/notes/3126893

## Contributing

This project is provided "as-is" and is mirroring the state as it is used in the SAP Cloud Platform ABAP Environment product, therefore we will accept bug reports but unfortunately we can't accept any pull requests.

## Licensing

Copyright 2020-2023 SAP SE or an SAP affiliate company and abap-atc-cr-cv-s4hc contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/abap-atc-cr-cv-s4hc).
