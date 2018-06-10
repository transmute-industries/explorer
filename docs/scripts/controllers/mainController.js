


angular
  .module('ethExplorer')
  .controller('mainCtrl', async function($rootScope, $scope, $location) {
    var web3 = $rootScope.web3;
    var maxBlocks = 50; // TODO: into setting file or user select
    const getBlockNumber = () =>{
        return new Promise((resolve, reject) => {
            web3.eth.getBlockNumber((err, data) =>{
               resolve(data)
            })
        });
    }

    const getBlock = (index) =>{
        return new Promise((resolve, reject) => {
            web3.eth.getBlock(index, (err, data) =>{
               resolve(data)
            })
        });
    }


    var blockNum = ($scope.blockNum = parseInt(await getBlockNumber(), 10));
    if (maxBlocks > blockNum) {
      maxBlocks = blockNum + 1;
    }

    // get latest 50 blocks
    $scope.blocks = [];
    for (var i = 0; i < maxBlocks; ++i) {
      $scope.blocks.push(await getBlock(blockNum - i));
    }

    $scope.processRequest = function() {
      var requestStr = $scope.ethRequest.split('0x').join('');

      if (requestStr.length === 40) return goToAddrInfos(requestStr);
      else if (requestStr.length === 64) {
        if (/[0-9a-zA-Z]{64}?/.test(requestStr))
          return goToTxInfos('0x' + requestStr);
        else if (/[0-9]{1,7}?/.test(requestStr))
          return goToBlockInfos(requestStr);
      } else if (parseInt(requestStr) > 0)
        return goToBlockInfos(parseInt(requestStr));

      alert("Don't know how to handle " + requestStr);
    };

    function goToBlockInfos(requestStr) {
      $location.path('/block/' + requestStr);
    }

    function goToAddrInfos(requestStr) {
      $location.path('/address/' + requestStr);
    }

    function goToTxInfos(requestStr) {
      $location.path('/transaction/' + requestStr);
    }
  });
