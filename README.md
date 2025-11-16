# SAP Cloud ERP - Released & Classic API list for ATC Cloud Readiness/Clean Core Check (Cloudification Repository)

[![REUSE status](https://api.reuse.software/badge/github.com/SAP/abap-atc-cr-cv-s4hc)](https://api.reuse.software/info/github.com/SAP/abap-atc-cr-cv-s4hc)

The repository contains the list of released APIs of SAP Cloud ERP. In addition also the objects that are not released are contained with the specification of successor objects. All objects are contained in one JSON file. This file is used as content for the ABAP Test Cockpit Check "Usage of Released APIs (Cloudification Repository)". This check can be used by customers and partners to analyse existing custom code concerning the usage of released and not released APIs on all ECC and S/4HANA releases. The check is available in SAP BTP, ABAP environment in an latest version.

## Requirements

Following the Cloud Readiness approach:
Please implement 
+ note "ATC Check for Github Repo: [3284711](https://launchpad.support.sap.com/#/notes/3284711)
+ note "Fix error in ATC Check" [3377462](https://launchpad.support.sap.com/#/notes/3377462)
+ note "own released objects support" [3507814](https://launchpad.support.sap.com/#/notes/3507814)

Following the Clean Core approach:
+ for SAP Cloud ERP Private only: Classic APIs support -note [3449860](https://launchpad.support.sap.com/#/notes/3449860)
+ Validate SimplificationitemDB - Using transaction SYCM: Menu Simplification Database - Show Information. Follow the update information in note note [2241080](https://launchpad.support.sap.com/#/notes/2241080)
- ATC Checks 'Usage of Released APIs' and 'Usage of Released APIs (Cloudification Repository)' Support Classic APIs

NEW NEW NEW  Clean Core Check
- ATC Checks "Usage of APIs" and "Allowed Enhancement Technologies" [3565942](https://me.sap.com/notes/3565942)

Please ensure [SSL setup](https://docs.abapgit.org/user-guide/setup/ssl-setup.html) to access git from S/4 system via ATC
[3582797 - ATC Check "Usage of APIs": SSL Handshake Failed](https://me.sap.com/notes/3582797/E)

## Partner Extensions

Partner are able to offer released APIs as part of the extension shipment. Customer will be able to consume the released APIs as part of customer ABAP Cloud development.
In case partner wants to offer Classic APIs to support customers to follow a clean core strategy.
Please implement note [Classic API Support in ATC Check "Usage of APIs" for Partners](https://me.sap.com/notes/3630552) and use Report SYCM_API_CLASSIFICATION_MANAGR to generate your partner JSON file. 
Ensure it follows the right JSON structure and includes only objects in own namespace. Every namespace needs it own JSON filename format objectClassifications_NAMESPACE.json.
As part of a pull request, the file will be offered in folder [src/partner](https://github.com/SAP/abap-atc-cr-cv-s4hc/tree/main/src/partner) if it is wished by partner.

## Download and Usage

### Target product SAP Cloud ERP

1. Activate in your ATC check variant the check "Cloud Readiness" -> Usage of Released APIs (Cloudification Repository)

2. In the attributes of the check enter the URL to this git repository e.g https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectReleaseInfoLatest.json
(content valid for SAP Cloud ERP)

Optional: Use another json file with a different content. For SAP Cloud ERP please use the same URL above and attach the current file objectReleaseInfoLatest.json

The corresponding CSV files can be consumed for offline processing in any spreadsheet tool.

### Target product SAP Cloud ERP Private

1. Activate in your ATC check variant the check "Clean Core" -> Usage of Released APIs (Cloudification Repository)

2. In the attributes of the check enter the URL to this git repository e.g https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectReleaseInfo_PCELatest.json
(content valid only for the latest SAP Cloud ERP Private version)

For SAP Cloud ERP Private  or on-premise, you can use the release version file with the string *PCE* included.
e.g. https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/  + filename

SAP Cloud ERP Private; example Release 2023 FPS03
--> https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src/objectReleaseInfo_PCE2023_3.json

With the note [3449860](https://launchpad.support.sap.com/#/notes/3449860)- ATC Checks 'Usage of Released APIs' and 'Usage of Released APIs (Cloudification Repository)' support for Classic APIs

With the note [3489660](https://me.sap.com/notes/3489660)- “Enable deployment into UI5 ABAP Repository with language version "ABAP for Cloud Development" using development namespaces”

*NEW NEW NEW*
With the introduction of the new ATC check 3565942 - ATC Checks "Usage of APIs" and "Allowed Enhancement Technologies" [https://me.sap.com/notes/3565942]
a new data format is needed and persited in file [objectClassifications_SAP.json](https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/refs/heads/main/src/objectClassifications_SAP.json)


Looking for >20000 Level A released dataelements for SAP Cloud ERP Private.

- Collection note [3470426](https://me.sap.com/notes/3470426)



## Cloudification API Viewer

*NEW NEW NEW*
- New layout of cloudification repository viewer - [Blog](https://community.sap.com/t5/technology-blog-posts-by-sap/new-cloudification-repository-viewer-for-clean-core-governance-and/ba-p/14236110)
- Cloudification Viewer will display now the number of APIs behind the repository name.
- Supporting partner classic APIs now (Partner Level A APIs will available as part of the partner addon installation) 

[SAP Cloud ERP](https://sap.github.io/abap-atc-cr-cv-s4hc/)

[SAP Cloud ERP Private](https://sap.github.io/abap-atc-cr-cv-s4hc/?version=objectReleaseInfo_PCELatest.json)

[SAP Cloud ERP Private - Classic API Clean Core Model](https://sap.github.io/abap-atc-cr-cv-s4hc/?version=objectClassifications_SAP.json)

*Click on a row with a double arrow to get more details about successors*

## Related projects

[Classic APIs to used as wrapper to bridge ABAP Cloud](https://sap.github.io/abap-atc-cr-cv-s4hc/?version=objectClassifications_SAP.json&states=classicAPI&labels=transactional-consistent)
Use filter value: classic API + label: transactional-consistent

Use the wrapper generator https://github.com/SAP-samples/tier2-rfc-proxy with details on https://community.sap.com/t5/technology-blogs-by-sap/how-to-generate-a-wrapper-for-function-modules-bapis-in-tier-2/ba-p/13692790#M172258

## LLM Support for SAP APIs

In pilot mode we support the brand new TOON format and offer a more compressed version of
Classic APIs in [objectClassifications_SAP.toon](https://github.com/SAP/abap-atc-cr-cv-s4hc/blob/main/src/objectClassifications_SAP.toon) with a compression optimization of 18,3%
Released API in [objectReleaseInfo_PCELatest.toon](https://github.com/SAP/abap-atc-cr-cv-s4hc/blob/main/src/objectReleaseInfo_PCELatest.toon) going down from 3659440 to 2989644 tokens.

## How to obtain support

This project is provided "as-is", with no expected changes or support. Of course you can always report bugs via GitHub issues.
Request for new APIs please use the corresponding CI channel for 
- [Customer Influence Channel for SAP Cloud ERP](https://influence.sap.com/sap/ino/#campaign/2759) or
- [Customer Influence Channel SAP Cloud ERP Private](https://influence.sap.com/sap/ino/#/campaign/3516) or
get more details in note [3126893](https://launchpad.support.sap.com/#/notes/3126893)

## Contributing

This project is provided "as-is" and is mirroring the state as it is used in the SAP Cloud Platform ABAP Environment product, therefore we will accept bug reports but unfortunately we can't accept any pull requests from customers.
Partner products with own namespace will receive a possibility to contribute via pull requests for own classic APIs JSONs.

## Licensing

Copyright 2020-2025 SAP SE or an SAP affiliate company and abap-atc-cr-cv-s4hc contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/abap-atc-cr-cv-s4hc).
