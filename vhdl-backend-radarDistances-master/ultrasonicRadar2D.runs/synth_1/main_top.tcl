# 
# Synthesis run script generated by Vivado
# 

set_msg_config -id {HDL 9-1061} -limit 100000
set_msg_config -id {HDL 9-1654} -limit 100000
create_project -in_memory -part xc7z020clg484-1

set_param project.singleFileAddWarning.threshold 0
set_param project.compositeFile.enableAutoGeneration 0
set_param synth.vivado.isSynthRun true
set_property webtalk.parent_dir C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.cache/wt [current_project]
set_property parent.project_path C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.xpr [current_project]
set_property default_lib xil_defaultlib [current_project]
set_property target_language VHDL [current_project]
set_property board_part em.avnet.com:zed:part0:1.3 [current_project]
set_property ip_output_repo c:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.cache/ip [current_project]
set_property ip_cache_permissions {read write} [current_project]
read_vhdl -library xil_defaultlib {
  C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.srcs/sources_1/new/edge_detection.vhd
  C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.srcs/sources_1/new/clkDivider.vhd
  C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.srcs/sources_1/new/uart.vhd
  C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.srcs/sources_1/new/ultrasonic_reading.vhd
  C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.srcs/sources_1/new/sevenSegment.vhd
  C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/ultrasonicRadar2D.srcs/sources_1/new/main_top.vhd
}
foreach dcp [get_files -quiet -all *.dcp] {
  set_property used_in_implementation false $dcp
}
read_xdc C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/constraintsFile.xdc
set_property used_in_implementation false [get_files C:/Users/Mike/Documents/ECE_492_SeniorProject/ultrasonicRadar2D_rev4DistancesOnly/constraintsFile.xdc]


synth_design -top main_top -part xc7z020clg484-1


write_checkpoint -force -noxdef main_top.dcp

catch { report_utilization -file main_top_utilization_synth.rpt -pb main_top_utilization_synth.pb }
