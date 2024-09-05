# S/4HANA Cloud - Released objects for ATC Check (Cloudification Repository)

[![REUSE status](https://api.reuse.software/badge/github.com/SAP/abap-atc-cr-cv-s4hc)](https://api.reuse.software/info/github.com/SAP/abap-atc-cr-cv-s4hc)

The repository contains the list of released APIs of S/4HANA Cloud. In addition also the objects that are not released are contained with the specification of successor objects. All objects are contained in one JSON file. This file is used as content for the ABAP Test Cockpit Check "Usage of Released APIs (Cloudification Repository)". This check can be used by customers and partners to analyse existing custom code concerning the usage of released and not released APIs on all ECC and S/4HANA releases. The check is available in SAP BTP, ABAP environment.

## Requirements

Please implement note "ATC Check for Github Repo: https://launchpad.support.sap.com/#/notes/3284711
+ note https://launchpad.support.sap.com/#/notes/3377462
+ Private Cloud Only: Note https://launchpad.support.sap.com/#/notes/3449860
- ATC Checks 'Usage of Released APIs' and 'Usage of Released APIs (Cloudification Repository)' Support Classic APIs

## Download and Usage

### Target product S/4HANA Cloud Public Edition

1. Activate in your ATC check variant the check "Cloud Readiness" -> Usage of Released APIs (Cloudification Repository)

2. In the attributes of the check enter the URL to this git repository e.g https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectReleaseInfoLatest.json
(content valid for S/4HANA Cloud Public Edition)

Optional: Use another json file with a different content. For S/4 HANA Cloud Public Edition please use the same URL above and attach the current file objectReleaseInfoLatest.json

The corresponding CSV files can be consumed for offline processing in any spreadsheet tool.

### Target product S/4HANA Cloud Private Edition

1. Activate in your ATC check variant the check "Cloud Readiness" -> Usage of Released APIs (Cloudification Repository)

2. In the attributes of the check enter the URL to this git repository e.g https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectReleaseInfo_PCE2023_1.json
(content valid for S/4HANA Cloud Private Edition)

For S/4HANA Cloud Private Edition or on-premise, you can use the release version file with the string *PCE* included.
e.g. https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/  + filename

S/4HANA Cloud Private Edition; example Release 2023 FPS1
--> https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectReleaseInfo_PCE2023_1.json

The corresponding CSV files can be consumed for offline processing in any spreadsheet tool.

With the note https://launchpad.support.sap.com/#/notes/3449860
- ATC Checks 'Usage of Released APIs' and 'Usage of Released APIs (Cloudification Repository)' support for Classic APIs

With the note https://me.sap.com/notes/3489660
- “Enable deployment into UI5 ABAP Repository with language version "ABAP for Cloud Development" using development namespaces”

Looking for >20000 Tier1 released dataelements for S/4HANA Cloud Private edition.

- Collection note https://me.sap.com/notes/3470426
 

The files objectReleaseInfo_PCE*.json or objectReleaseInfo_PCE*.csv contains the APIs released by SAP to be consumed in your tier 1 implementations of the 3-tier extensibility model.

The files objectClassifications.json or objectClassifications.csv contains the classic APIs  to be consumed in your tier 2 implementations of the 3-tier extensibility model.
--> https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectClassifications.json

Remark: CSV file contains more detailed information including the object list which will not be recommended. The reasons are internal consumptions or ABAP Cloud violations.
The JSON file conatins the positive list of ClassicAPIs. Entries with value noClassicAPI will offer you a corresponding successor object.

## Cloudification API Viewer

S/4HANA Cloud Public Edition https://sap.github.io/abap-atc-cr-cv-s4hc/

S/4HANA Cloud Private Edition https://sap.github.io/abap-atc-cr-cv-s4hc/?version=objectReleaseInfo_PCE2023_1.json

S/4HANA Cloud Private Edition - Classic APIs https://sap.github.io/abap-atc-cr-cv-s4hc/?version=objectClassifications.json

*Click on a row to get more details about successors*

## Related projects

Use the tier2 wrapper generator https://github.com/SAP-samples/tier2-rfc-proxy with details on https://community.sap.com/t5/technology-blogs-by-sap/how-to-generate-a-wrapper-for-function-modules-bapis-in-tier-2/ba-p/13692790#M172258


## How to obtain support

This project is provided "as-is", with no expected changes or support. Of course you can always report bugs via GitHub issues.
Request for new APIs please use the corresponding CI channel for 
- S/4HANA Cloud Public Edition https://influence.sap.com/sap/ino/#campaign/2759 or
- S/4HANA Cloud Private Edition https://influence.sap.com/sap/ino/#/campaign/3516 or
get details in note https://launchpad.support.sap.com/#/notes/3126893

## Contributing

This project is provided "as-is" and is mirroring the state as it is used in the SAP Cloud Platform ABAP Environment product, therefore we will accept bug reports but unfortunately we can't accept any pull requests.

## Licensing

Copyright 2020-2024 SAP SE or an SAP affiliate company and abap-atc-cr-cv-s4hc contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/abap-atc-cr-cv-s4hc).
