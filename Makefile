#
# Makefile
#
# Prepares everything. :)
#
# Requires:
#		gnu Make
#		npm
#

# tools
#
# Note: These targets need to be placed after a '|', when being used as dependencies, to avoid
#				them being re-installed every time.
#
bower=node_modules/.bin/bower
npm=$(shell which npm)

libs=lib/svg.min.js lib/jquery.min.js lib/rx.lite.min.js

#---
all: $(libs)

help:
	@echo ""
	@echo "make"
	@echo "make update"
	@echo ""

# Update the libraries in 'lib/' - this is only done manually.
#
update: | $(npm) $(bower)
	$(bower) update
	$(npm) -v update rx-lite

# Note: normally 'make clean' would not change anything in the repo. This does, however,
#			clear away the JavaScript files in 'lib/'.
#
clean:
	-rm $(libs)

# To be used in release testing. Clears the slate like it was a fresh clone.
#
wipe:
	rm -rf ./node_modules ./bower_components

#---
# Updating libs
#
# Note: it is important the libs end up in the version control, so that 'gh-pages' branch
#				has them. I.e. we shouldn't reference the files directly from 'bower_components'
#				and 'node_modules' - those are simply delivery details.
#

#- -
svgjs_min=bower_components/svg.js/dist/svg.min.js

lib/svg.min.js: $(svgjs_min)
	cp $< $@

$(svgjs_min): | $(bower)
	$(bower) install svg.js
	@test -f $@ || (echo "ERROR: couldn't create $@"; false)

#- -
jquery_min=bower_components/jquery/dist/jquery.min.js

lib/jquery.min.js: $(jquery_min)
	cp $< $@
	cp $(<:.min.js=.min.map) lib/

$(jquery_min): | $(bower)
	$(bower) install jquery
	@test -f $@ || (echo "ERROR: couldn't create $@"; false)

#- -
# Note: 'bower' does not have 'rs.lite' but 'npm' has
#  
rxlite_min=node_modules/rx-lite/rx.lite.min.js

lib/rx.lite.min.js: $(rxlite_min)
	cp $< $@
	cp $(<:.min.js=.map) lib/

$(rxlite_min): | $(npm)
	$(npm) install rx-lite
	@test -f $@ || (echo "ERROR: couldn't create $@"; false)
	
#---
# Installing tools
#
ifeq ($(npm),)
$(error ERROR: No 'npm', please install Node.js (e.g. 'brew install node') https://nodejs.org/en/)
endif

$(bower): | $(npm)
	$(npm) install bower

#---
echo: | $(npm)
	@echo $(npm)

#--	
.PHONY: help libs update echo
