import os
from setuptools import find_packages, setup

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as readme:
    README = readme.read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='position',
    version='0.3',
    packages=find_packages(),
    include_package_data=True,
    license='BSD License',
    description='A simple Django mapping app',
    long_description=README,
    url='http:/gitlab.blueline.mg/default/position.git',
    author='Thomas Ayih-Akakpo',
    author_email='thomas.ayih-akakpo@gulfsat.mg',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: 1.9',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)

