# abap-atc-cr-cv-s4hc
The repository contains the list of released APIs of S/4HANA Cloud. In addition also the objects that are not released are contained with the specification of successort objects. All objects are contained in one JSON file. This file is used as content for the ABAP Test Cockpit Check "Usage of Released APIs (Cloudification Repository)". This check can be used by customers and partners to analyse existing custom code concerning the usage of released and not released APIs on all ECC and S/4HANA releases. The check is available in SAP BTP, ABAP environment.    

## Requirements


## Download and Installation

1. Activate in your ATC check variant the check "Cloud Readiness" -> Usage of Released APIs (Cloudification Repository)

2. In the attributes of the check enter the URL to this git repository https://github.com/SAP/abap-atc-cr-cv-s4hc/src/objectReleaseInfoLatest.json

Optional: use another json file with a different content


## How to obtain support
This project is provided "as-is", with no expected changes or support. Of course you can always report Bugs via GitHubs bug tracking system.

## Contributing
This project is provided "as-is" and is mirroring the state as it is used in the SAP Cloud Platform ABAP Environment product, therefore we will accept bug reports but we won't accept any pull requests.
